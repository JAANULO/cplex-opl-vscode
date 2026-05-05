import * as vscode from 'vscode';
import { getSymbols } from '../utils/symbols';

export class OplDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.DocumentSymbol[]> {
        
        const symbols: vscode.DocumentSymbol[] = [];
        const oplSymbols = getSymbols(document);

        oplSymbols.forEach(s => {
            // Pomijamy iteratory w widoku struktury (zbyt duży szum), 
            // zostawiamy tylko istotne elementy modelu.
            if (s.type === 'iterator') return;

            const symbol = new vscode.DocumentSymbol(
                s.name,
                s.type,
                s.kind,
                s.range,
                s.range
            );
            symbols.push(symbol);
        });

        // Dodatkowe skanowanie bloków, których nie mamy w getSymbols (np. execute)
        const text = document.getText();
        const blockRegex = /^\s*(execute|subject\s+to|constraints)\s*({|)/gm;
        let match;
        while ((match = blockRegex.exec(text)) !== null) {
            const blockName = match[1].trim();
            const pos = document.positionAt(match.index);
            const range = new vscode.Range(pos, pos.translate(0, blockName.length));
            
            if (!symbols.some(s => s.name === blockName && s.range.start.line === range.start.line)) {
                symbols.push(new vscode.DocumentSymbol(
                    blockName,
                    "Block",
                    vscode.SymbolKind.Module,
                    range,
                    range
                ));
            }
        }

        // Sort symbols by line number to present them in document order
        symbols.sort((a: vscode.DocumentSymbol, b: vscode.DocumentSymbol) => a.range.start.line - b.range.start.line);

        return symbols;
    }
}
