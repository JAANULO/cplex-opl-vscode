import * as vscode from 'vscode';

export class OplReferenceProvider implements vscode.ReferenceProvider {
    provideReferences(
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.ReferenceContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Location[]> {
        
        const range = document.getWordRangeAtPosition(position);
        if (!range) return null;

        const name = document.getText(range);
        const text = document.getText();
        const locations: vscode.Location[] = [];

        // Szukamy wszystkich wystąpień identyfikatora w dokumencie
        const identifierRegex = new RegExp(`\\b${name}\\b`, 'g');
        let match;
        const lines = text.split(/\r?\n/);

        while ((match = identifierRegex.exec(text)) !== null) {
            const startPos = document.positionAt(match.index);
            
            // 1. Pomiń komentarze liniowe
            const lineText = lines[startPos.line];
            const commentStart = lineText.indexOf('//');
            if (commentStart !== -1 && startPos.character >= commentStart) continue;

            // 2. Pomiń komentarze blokowe
            const prefix = text.substring(0, match.index);
            const openComments = (prefix.match(/\/\*/g) || []).length;
            const closeComments = (prefix.match(/\*\//g) || []).length;
            if (openComments > closeComments) continue;

            // 3. Pomiń stringi
            const currentLinePrefix = prefix.split(/\r?\n/).pop() || '';
            const quoteCount = (currentLinePrefix.match(/"/g) || []).length;
            if (quoteCount % 2 !== 0) continue;

            locations.push(new vscode.Location(
                document.uri,
                new vscode.Range(startPos, startPos.translate(0, name.length))
            ));
        }

        return locations;
    }
}
