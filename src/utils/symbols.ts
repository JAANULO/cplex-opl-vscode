import * as vscode from 'vscode';

export interface OplSymbol {
    name: string;
    type: string;
    range: vscode.Range;
    kind: vscode.SymbolKind;
    scopeRange?: vscode.Range; // Zakres, w którym zmienna jest widoczna
}

export function getSymbols(document: vscode.TextDocument): OplSymbol[] {
    const symbols: OplSymbol[] = [];
    const text = document.getText();

    // 1. Zmienne globalne (dvar, float, int, tuple, range, setof itp.)
    const globalVarRegex = /^\s*(dvar\s+(?:int|float|boolean)(?:\+|)|range|tuple|float|int|boolean|string|dexpr|setof\s*(?:<[^>]+>|))\s+([a-zA-Z_][a-zA-Z0-9_]*)/gm;
    let match;
    while ((match = globalVarRegex.exec(text)) !== null) {
        const type = match[1];
        const name = match[2];
        const pos = document.positionAt(match.index + match[0].indexOf(name));
        symbols.push({
            name,
            type,
            range: new vscode.Range(pos, pos.translate(0, name.length)),
            kind: type.includes('dvar') ? vscode.SymbolKind.Variable : vscode.SymbolKind.Constant
        });
    }

    // 1b. Nazwy celów (maximize/minimize Name:)
    const objRegex = /^\s*(minimize|maximize)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
    while ((match = objRegex.exec(text)) !== null) {
        const name = match[2];
        const pos = document.positionAt(match.index + match[0].indexOf(name));
        symbols.push({
            name,
            type: 'objective',
            range: new vscode.Range(pos, pos.translate(0, name.length)),
            kind: vscode.SymbolKind.Function
        });
    }

    // 1c. Etykiety ograniczeń (Label: sum...)
    const labelRegex = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
    while ((match = labelRegex.exec(text)) !== null) {
        const name = match[1];
        const pos = document.positionAt(match.index + match[0].indexOf(name));
        symbols.push({
            name,
            type: 'label',
            range: new vscode.Range(pos, pos.translate(0, name.length)),
            kind: vscode.SymbolKind.Field
        });
    }

    // 1d. Zmienne skryptowe (var name = ...)
    const scriptVarRegex = /\bvar\s+([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
    while ((match = scriptVarRegex.exec(text)) !== null) {
        const name = match[1];
        const pos = document.positionAt(match.index + match[0].indexOf(name));
        symbols.push({
            name,
            type: 'script-var',
            range: new vscode.Range(pos, pos.translate(0, name.length)),
            kind: vscode.SymbolKind.Variable
        });
    }

    // 2. Iteratory lokalne (forall, sum, for)
    // Szukamy wzorców typu forall(i in ..., j in ...), sum(j in ...) lub for(var i=0; ...)
    const loopRegex = /(?:forall|sum|for)\s*\(([^)]+)\)/g;
    while ((match = loopRegex.exec(text)) !== null) {
        const content = match[1]; // Zawartość nawiasów
        const parts = content.split(/[,;]/); // Rozdzielamy po przecinku lub średniku

        // Wyznacz zakres zasięgu dla tych iteratorów (do końca bloku lub średnika)
        let openBrackets = 0;
        let foundStart = false;
        let scopeEnd = document.lineAt(document.lineCount - 1).range.end;

        for (let i = match.index; i < text.length; i++) {
            if (text[i] === '(') { openBrackets++; foundStart = true; }
            if (text[i] === ')') { openBrackets--; }
            if (foundStart && openBrackets === 0) {
                // Szukamy końca zasięgu, biorąc pod uwagę zagnieżdżone klamry { }
                let scopeOffset = 0;
                let braceStack = 0;
                let foundBrace = false;
                
                for (let j = i + 1; j < text.length; j++) {
                    if (text[j] === '{') { braceStack++; foundBrace = true; }
                    if (text[j] === '}') { 
                        braceStack--; 
                        foundBrace = true;
                        if (braceStack === 0) {
                            scopeOffset = j - (i + 1);
                            break;
                        }
                    }
                    
                    // Jeśli nie ma klamer (prosta instrukcja), a trafiliśmy na średnik -> koniec
                    if (!foundBrace && text[j] === ';') {
                        scopeOffset = j - (i + 1);
                        break;
                    }
                }
                
                if (scopeOffset === 0) scopeOffset = text.length - (i + 1);
                scopeEnd = document.positionAt(i + 1 + scopeOffset);
                break;
            }
        }

        // Dodaj każdy iterator z osobna
        parts.forEach(part => {
            const iterMatch = /\s*(?:var\s+|)([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:in|=)/.exec(part);
            if (iterMatch) {
                const name = iterMatch[1];
                // Wyliczamy pozycję w oryginalnym tekście
                const partOffset = content.indexOf(part);
                const nameOffset = part.indexOf(name);
                const absIndex = match!.index + match![0].indexOf(content) + partOffset + nameOffset;
                const startPos = document.positionAt(absIndex);

                symbols.push({
                    name,
                    type: 'iterator',
                    range: new vscode.Range(startPos, startPos.translate(0, name.length)),
                    kind: vscode.SymbolKind.Variable,
                    scopeRange: new vscode.Range(startPos, scopeEnd)
                });
            }
        });
    }

    return symbols;
}

export function getAvailableSymbols(document: vscode.TextDocument, position: vscode.Position): OplSymbol[] {
    const allSymbols = getSymbols(document);
    return allSymbols.filter(symbol => {
        // Zmienna globalna (brak scopeRange) jest zawsze dostępna
        if (!symbol.scopeRange) {
            return true;
        }
        // Zmienna lokalna jest dostępna tylko w swoim zakresie
        return symbol.scopeRange.contains(position);
    });
}
