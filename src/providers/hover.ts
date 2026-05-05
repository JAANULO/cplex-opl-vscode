import * as vscode from 'vscode';
import { getSymbols } from '../utils/symbols';

export class OplHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        
        const range = document.getWordRangeAtPosition(position);
        if (!range) return null;

        const name = document.getText(range);
        const symbols = getSymbols(document);

        // Szukamy definicji tego symbolu
        const declaration = symbols.find(s => s.name === name);
        if (!declaration) return null;

        // Budujemy czytelny opis typu
        let typeInfo = '';
        switch(declaration.type) {
            case 'dvar': typeInfo = 'Decision Variable (dvar)'; break;
            case 'dexpr': typeInfo = 'Decision Expression (dexpr)'; break;
            case 'objective': typeInfo = 'Objective Function'; break;
            case 'iterator': typeInfo = 'Local Iterator'; break;
            case 'label': typeInfo = 'Constraint Label'; break;
            case 'script-var': typeInfo = 'OPLScript Variable (var)'; break;
            default: typeInfo = `Parameter (${declaration.type})`;
        }

        const contents = new vscode.MarkdownString();
        contents.appendCodeblock(`(OPL) ${name}`, 'opl');
        contents.appendMarkdown(`**Type:** ${typeInfo}\n\n`);
        
        // Dodaj linię z definicją, jeśli to nie jest iterator (które zazwyczaj są blisko)
        if (declaration.type !== 'iterator') {
            contents.appendMarkdown(`Defined on line ${declaration.range.start.line + 1}`);
        }

        return new vscode.Hover(contents);
    }
}
