import * as vscode from 'vscode';

export class OplDocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {
    provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.TextEdit[]> {
        
        const fullText = document.getText();
        const indentString = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';

        // 1. Basic spacing and standardization (whole document)
        let formatted = fullText
            .replace(/\s*=\s*/g, ' = ')
            .replace(/\s*<=\s*/g, ' <= ')
            .replace(/\s*>=\s*/g, ' >= ')
            .replace(/  +/g, ' ');

        // 2. Re-apply indentation line by line
        const lines = formatted.split('\n');
        let indentLevel = 0;
        const finalLines = lines.map(line => {
            let trimmed = line.trim();
            if (trimmed.length === 0) return '';

            if (trimmed.startsWith('}')) indentLevel = Math.max(0, indentLevel - 1);
            
            const result = indentString.repeat(indentLevel) + trimmed;
            
            if (trimmed.endsWith('{')) indentLevel++;
            return result;
        });

        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(fullText.length)
        );

        return [vscode.TextEdit.replace(fullRange, finalLines.join('\n'))];
    }
}
