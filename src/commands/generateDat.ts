import * as vscode from 'vscode';
import { getSymbols } from '../utils/symbols';

export async function generateDatSkeletonCommand() {
    const editor = vscode.window.activeTextEditor;
    if (!editor || !editor.document.fileName.endsWith('.mod')) {
        vscode.window.showErrorMessage('Otwórz plik .mod, aby wygenerować szkielet danych.');
        return;
    }

    const document = editor.document;
    const text = document.getText();
    const symbols = getSymbols(document);

    // Filtrujemy tylko parametry, które nie są zainicjalizowane w kodzie (czyli po nazwie następuje ;)
    const parametersToInit = symbols.filter(s => {
        // Pomijamy zmienne decyzyjne, cele, iteratory itp.
        if (s.type.includes('dvar') || s.type === 'objective' || s.type === 'iterator' || s.type === 'label' || s.type === 'script-var' || s.type === 'dexpr') {
            return false;
        }

        // Sprawdzamy co jest po nazwie symbolu w tekście
        const offset = document.offsetAt(s.range.end);
        const tail = text.substring(offset, offset + 50); // Bierzemy kawałek tekstu po nazwie
        
        // Jeśli pierwszy istotny znak to ';', oznacza to że parametr czeka na dane w .dat
        // Jeśli to '=', oznacza to że jest zainicjalizowany w .mod
        const match = /^\s*([;=])/.exec(tail);
        return match && match[1] === ';';
    });

    if (parametersToInit.length === 0) {
        vscode.window.showInformationMessage('Nie znaleziono parametrów wymagających inicjalizacji w pliku .dat.');
        return;
    }

    let datContent = `// Szkielet danych wygenerowany dla: ${vscode.workspace.asRelativePath(document.uri)}\n\n`;
    
    parametersToInit.forEach(p => {
        datContent += `${p.name} = ...;\n`;
    });

    // Otwórz nowy dokument z wygenerowaną treścią
    const datDoc = await vscode.workspace.openTextDocument({
        content: datContent,
        language: 'opl'
    });

    await vscode.window.showTextDocument(datDoc);
    vscode.window.showInformationMessage(`Wygenerowano szkielet dla ${parametersToInit.length} parametrów.`);
}
