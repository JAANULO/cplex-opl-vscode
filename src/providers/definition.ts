import * as vscode from 'vscode';
import { getAvailableSymbols } from '../utils/symbols';

export class OplDefinitionProvider implements vscode.DefinitionProvider {
    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Definition> {
        
        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return null;
        }

        const word = document.getText(range);
        const availableSymbols = getAvailableSymbols(document, position);

        // Find the symbol that matches the word at the current position
        const symbol = availableSymbols.find(s => s.name === word);
        if (symbol) {
            return new vscode.Location(document.uri, symbol.range);
        }

        return null;
    }
}
