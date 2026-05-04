import * as vscode from 'vscode';

export class OplDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.DocumentSymbol[]> {
        
        const symbols: vscode.DocumentSymbol[] = [];
        const text = document.getText();
        
        // Match variables, arrays, ranges, tuples
        const varRegex = /^\s*(dvar\s+(?:int|float|boolean)(?:\+|)?|range|tuple|float|int|boolean)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gm;
        let match;
        while ((match = varRegex.exec(text)) !== null) {
            const type = match[1];
            const name = match[2];
            const pos = document.positionAt(match.index);
            const range = new vscode.Range(pos, pos);
            const symbol = new vscode.DocumentSymbol(
                name,
                type,
                type.includes('dvar') ? vscode.SymbolKind.Variable : (type === 'tuple' ? vscode.SymbolKind.Struct : vscode.SymbolKind.Constant),
                range,
                range
            );
            symbols.push(symbol);
        }

        // Match Objective
        const objRegex = /^\s*(minimize|maximize)\s+([a-zA-Z_][a-zA-Z0-9_]*|)/gm;
        while ((match = objRegex.exec(text)) !== null) {
            const type = match[1];
            const name = match[2] || 'Objective';
            const pos = document.positionAt(match.index);
            const range = new vscode.Range(pos, pos);
            const symbol = new vscode.DocumentSymbol(
                name,
                type,
                vscode.SymbolKind.Function,
                range,
                range
            );
            symbols.push(symbol);
        }

        // Match Subject To block
        const stRegex = /^\s*(subject to)\s*\{/gm;
        while ((match = stRegex.exec(text)) !== null) {
            const pos = document.positionAt(match.index);
            const range = new vscode.Range(pos, pos);
            const symbol = new vscode.DocumentSymbol(
                'Constraints',
                'subject to',
                vscode.SymbolKind.Namespace,
                range,
                range
            );
            symbols.push(symbol);
        }

        // Match Execute blocks
        const execRegex = /^\s*(execute)\s*([a-zA-Z_][a-zA-Z0-9_]*|)\s*\{/gm;
        while ((match = execRegex.exec(text)) !== null) {
            const name = match[2] || 'Script';
            const pos = document.positionAt(match.index);
            const range = new vscode.Range(pos, pos);
            const symbol = new vscode.DocumentSymbol(
                name,
                'execute',
                vscode.SymbolKind.Method,
                range,
                range
            );
            symbols.push(symbol);
        }

        // Sort symbols by line number to present them in document order
        symbols.sort((a, b) => a.range.start.line - b.range.start.line);

        return symbols;
    }
}
