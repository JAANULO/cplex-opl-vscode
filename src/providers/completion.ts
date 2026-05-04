import * as vscode from 'vscode';

export class OplCompletionItemProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        
        const keywords = [
            'dvar', 'dexpr', 'minimize', 'maximize', 'subject to', 
            'forall', 'sum', 'if', 'else', 'int', 'float', 'boolean', 
            'range', 'tuple', 'execute', 'main', 'using', 'cp', 
            'allDifferent', 'pack', 'pulse', 'step', 'interval', 
            'sequence', 'in', 'string', 'setof'
        ];

        const completionItems: vscode.CompletionItem[] = keywords.map(keyword => {
            const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
            return item;
        });

        // Built-in functions can be added as functions
        const functions = [
            'abs', 'max', 'min', 'endOf', 'startOf', 'lengthOf'
        ];

        functions.forEach(func => {
            const item = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function);
            item.insertText = new vscode.SnippetString(`${func}($1)`);
            completionItems.push(item);
        });

        return completionItems;
    }
}
