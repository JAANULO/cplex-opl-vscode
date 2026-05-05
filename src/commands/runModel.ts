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
    const fileName = document.fileName;
    let modPath = '';
    let datPath = '';

    if (fileName.endsWith('.mod')) {
        modPath = fileName;
        const directory = path.dirname(modPath);
        const baseName = path.basename(modPath, '.mod');
        const potentialDat = path.join(directory, `${baseName}.dat`);
        if (fs.existsSync(potentialDat)) {
            datPath = potentialDat;
        }
    } else if (fileName.endsWith('.dat')) {
        datPath = fileName;
        const directory = path.dirname(datPath);
        const baseName = path.basename(datPath, '.dat');
        const potentialMod = path.join(directory, `${baseName}.mod`);
        if (fs.existsSync(potentialMod)) {
            modPath = potentialMod;
        } else {
            vscode.window.showErrorMessage(`Nie znaleziono pasującego pliku .mod dla ${path.basename(fileName)}`);
            return;
        }
    } else {
        vscode.window.showErrorMessage('Otwarty plik nie jest modelem (.mod) ani danymi (.dat) OPL.');
        return;
    }

    // Save the file before running
    if (document.isDirty) {
        document.save();
    }

    const oplrunPath = getOplrunPath();
    const escapedOplrunPath = oplrunPath.includes(' ') ? `"${oplrunPath}"` : oplrunPath;

    let command = `${escapedOplrunPath} "${modPath}"`;
    if (datPath) {
        command += ` "${datPath}"`;
        vscode.window.showInformationMessage(`Uruchamianie ${path.basename(modPath)} z ${path.basename(datPath)}`);
    } else {
        vscode.window.showInformationMessage(`Uruchamianie ${path.basename(modPath)}`);
    }

    if (!runTerminal || runTerminal.exitStatus !== undefined) {
        runTerminal = vscode.window.createTerminal('OPL Run');
    }
    
    runTerminal.show();
    runTerminal.sendText('clear'); // or 'cls' on Windows, but terminal might be pwsh/bash
    runTerminal.sendText(command);
}
