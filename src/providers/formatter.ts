import * as vscode from 'vscode';

export class OplDocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {
    provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.TextEdit[]> {
        
        const edits: vscode.TextEdit[] = [];
        let indentLevel = 0;
        const indentString = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const originalText = line.text;
            let trimmedText = originalText.trim();

            if (trimmedText.length === 0) {
                continue; // Skip empty lines for formatting
            }

            // Decrease indent if the line starts with a closing brace
            if (trimmedText.startsWith('}')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }

            // Apply indentation
            let newText = indentString.repeat(indentLevel) + trimmedText;

            // Basic spacing rules:
            // Ensure space after keywords like dvar, int, boolean
            // Ensure space around operators like =, +, -, <=, >=, ==
            newText = newText
                .replace(/\s*([=+\-*/]|<=|>=|==|!=)\s*/g, ' $1 ')
                .replace(/\s*;\s*/g, ';\n') // Standardize semicolon (though this could break things if inline, better to just trim spaces before ;)
                .replace(/\s+;/g, ';');
            
            // Re-collapse double spaces introduced by simple replacements
            newText = newText.replace(/  +/g, ' ');

            // Increase indent if the line ends with an opening brace
            if (trimmedText.endsWith('{')) {
                indentLevel++;
            }

            // Only create an edit if the line actually changed
            if (newText !== originalText) {
                edits.push(vscode.TextEdit.replace(line.range, newText));
            }
        }

        return edits;
    }
}
