const fs = require('fs');
const path = require('path');

class Range {
    constructor(sl, sc, el, ec) {
        this.start = { line: sl, character: sc };
        this.end = { line: el, character: ec };
    }
    contains(pos) {
        if (pos.line < this.start.line || pos.line > this.end.line) return false;
        if (pos.line === this.start.line && pos.character < this.start.character) return false;
        if (pos.line === this.end.line && pos.character > this.end.character) return false;
        return true;
    }
}

function getSymbols(text) {
    const symbols = [];
    const lines = text.split(/\r?\n/);

    // 1. Global, Script Vars, Objectives, Labels
    const varRegex = /\b(?:dvar\s+(?:int|float|boolean)(?:\+|)|range|tuple|float|int|boolean|string|dexpr|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gm;
    let match;
    while ((match = varRegex.exec(text)) !== null) {
        const name = match[1];
        const index = match.index + match[0].indexOf(name);
        const line = findLine(text, index);
        const col = index - text.lastIndexOf('\n', index) - 1;
        symbols.push({ name, range: new Range(line, col, line, col + name.length) });
    }

    const labelRegex = /^\s*(minimize|maximize|)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
    while ((match = labelRegex.exec(text)) !== null) {
        const name = match[2];
        if (!name) continue;
        const index = match.index + match[0].indexOf(name);
        const line = findLine(text, index);
        const col = index - text.lastIndexOf('\n', index) - 1;
        symbols.push({ name, range: new Range(line, col, line, col + name.length) });
    }

    // 2. Iterators with Nested Scope Support
    const loopRegex = /(?:forall|sum|for)\s*\(([^)]+)\)/g;
    while ((match = loopRegex.exec(text)) !== null) {
        const content = match[1];
        const parts = content.split(/[,;]/);
        let openBrackets = 0;
        let scopeEndLine = lines.length - 1;

        // Find loop closing parenthesis index
        let closingParenIndex = -1;
        for (let i = match.index; i < text.length; i++) {
            if (text[i] === '(') openBrackets++;
            if (text[i] === ')') openBrackets--;
            if (openBrackets === 0 && i > match.index) {
                closingParenIndex = i;
                break;
            }
        }

        if (closingParenIndex !== -1) {
            let braceStack = 0;
            let foundBrace = false;
            let scopeOffset = text.length - (closingParenIndex + 1);

            for (let j = closingParenIndex + 1; j < text.length; j++) {
                if (text[j] === '{') { braceStack++; foundBrace = true; }
                if (text[j] === '}') { 
                    braceStack--; 
                    foundBrace = true;
                    if (braceStack === 0) {
                        scopeOffset = j - (closingParenIndex + 1);
                        break;
                    }
                }
                if (!foundBrace && text[j] === ';') {
                    scopeOffset = j - (closingParenIndex + 1);
                    break;
                }
            }
            scopeEndLine = findLine(text, closingParenIndex + 1 + scopeOffset);
        }

        parts.forEach(part => {
            const iterMatch = /\s*(?:var\s+|)([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:in|=)/.exec(part);
            if (iterMatch) {
                const name = iterMatch[1];
                const absIndex = match.index + match[0].indexOf(content) + part.indexOf(name);
                const line = findLine(text, absIndex);
                const col = absIndex - text.lastIndexOf('\n', absIndex) - 1;
                symbols.push({
                    name,
                    range: new Range(line, col, line, col + name.length),
                    scopeRange: new Range(line, col, scopeEndLine, 1000)
                });
            }
        });
    }
    return symbols;
}

function refreshDiagnostics(text) {
    console.log("--- Weryfikacja pliku (V6) ---");
    const symbols = getSymbols(text);
    const keywords = new Set([
        'dvar', 'dexpr', 'minimize', 'maximize', 'subject', 'to', 'constraints',
        'forall', 'sum', 'if', 'else', 'execute', 'main', 'using', 'cp', 'CP',
        'int', 'float', 'boolean', 'string', 'range', 'tuple', 'setof',
        'in', 'allDifferent', 'pack', 'pulse', 'step', 'interval', 'sequence', 'all',
        'assert', 'include', 'sorted', 'ordered', 'min', 'max', 'abs',
        'startOf', 'endOf', 'size', 'card', 'item', 'first', 'last', 'prev', 'next',
        'var', 'for', 'while', 'function', 'return', 'new', 'this', 'writeln', 'Math', 'sqrt', 'Infinity'
    ]);

    const identifierRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
    let match;
    let errorCount = 0;

    while ((match = identifierRegex.exec(text)) !== null) {
        const name = match[1];
        if (keywords.has(name)) continue;
        if (isComment(text, match.index)) continue;

        const line = findLine(text, match.index);
        const col = match.index - text.lastIndexOf('\n', match.index) - 1;

        const isDeclaration = symbols.some(s => s.name === name && s.range.start.line === line);
        if (!isDeclaration) {
            const available = symbols.filter(s => !s.scopeRange || s.scopeRange.contains({line, character: col}));
            if (!available.some(s => s.name === name)) {
                console.log(`[!] Niezdefiniowana zmienna '${name}' w linii ${line + 1}`);
                errorCount++;
            }
        }
    }
    console.log(`Zakończono. Liczba błędów: ${errorCount}`);
}

function isComment(text, index) {
    const lineStart = text.lastIndexOf('\n', index) + 1;
    if (text.substring(lineStart, index).includes('//')) return true;
    const prefix = text.substring(0, index);
    return (prefix.match(/\/\*/g) || []).length > (prefix.match(/\*\//g) || []).length;
}

function findLine(text, index) {
    return text.substring(0, index).split('\n').length - 1;
}

const filePath = process.argv[2];
const content = fs.readFileSync(filePath, 'utf8');
refreshDiagnostics(content);
