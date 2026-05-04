import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getOplrunPath } from '../utils/oplrun';

let runTerminal: vscode.Terminal | undefined;

export function runModelCommand() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active editor found. Please open an OPL .mod file.');
        return;
    }

    const document = editor.document;
    if (!document.fileName.endsWith('.mod')) {
        vscode.window.showErrorMessage('Active file is not an OPL .mod file.');
        return;
    }

    // Save the file before running
    if (document.isDirty) {
        document.save();
    }

    const modPath = document.fileName;
    const directory = path.dirname(modPath);
    const baseName = path.basename(modPath, '.mod');
    const datPath = path.join(directory, `${baseName}.dat`);

    const oplrunPath = getOplrunPath();
    
    // Check if the path contains spaces, if so, quote it
    const escapedOplrunPath = oplrunPath.includes(' ') ? `"${oplrunPath}"` : oplrunPath;

    let command = `${escapedOplrunPath} "${modPath}"`;
    if (fs.existsSync(datPath)) {
        command += ` "${datPath}"`;
        vscode.window.showInformationMessage(`Running ${baseName}.mod with ${baseName}.dat`);
    } else {
        vscode.window.showInformationMessage(`Running ${baseName}.mod`);
    }

    if (!runTerminal || runTerminal.exitStatus !== undefined) {
        runTerminal = vscode.window.createTerminal('OPL Run');
    }
    
    runTerminal.show();
    runTerminal.sendText('clear'); // or 'cls' on Windows, but terminal might be pwsh/bash
    runTerminal.sendText(command);
}
