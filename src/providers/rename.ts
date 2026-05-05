import * as vscode from 'vscode';

export class OplRenameProvider implements vscode.RenameProvider {
    provideRenameEdits(
        document: vscode.TextDocument,
        position: vscode.Position,
        newName: string,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.WorkspaceEdit> {
        
        const range = document.getWordRangeAtPosition(position);
        if (!range) return null;

        const oldName = document.getText(range);
        const text = document.getText();
        const edit = new vscode.WorkspaceEdit();

        // Regex szukający dokładnie tego słowa
        const identifierRegex = new RegExp(`\\b${oldName}\\b`, 'g');
        let match;
        const lines = text.split(/\r?\n/);

        while ((match = identifierRegex.exec(text)) !== null) {
            const startPos = document.positionAt(match.index);
            
            // Filtrowanie (identyczne jak w ReferenceProvider)
            const lineText = lines[startPos.line];
            const commentStart = lineText.indexOf('//');
            if (commentStart !== -1 && startPos.character >= commentStart) continue;

            const prefix = text.substring(0, match.index);
            const openComments = (prefix.match(/\/\*/g) || []).length;
            const closeComments = (prefix.match(/\*\//g) || []).length;
            if (openComments > closeComments) continue;

            const currentLinePrefix = prefix.split(/\r?\n/).pop() || '';
            const quoteCount = (currentLinePrefix.match(/"/g) || []).length;
            if (quoteCount % 2 !== 0) continue;

            const matchRange = new vscode.Range(startPos, startPos.translate(0, oldName.length));
            edit.replace(document.uri, matchRange, newName);
        }

        return edit;
    }

    prepareRename(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Range | { range: vscode.Range; placeholder: string }> {
        
        const range = document.getWordRangeAtPosition(position);
        if (!range) throw new Error("Wybierz poprawny identyfikator do zmiany nazwy.");
        
        return range;
    }
}
