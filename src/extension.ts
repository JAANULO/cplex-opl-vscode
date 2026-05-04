// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { runModelCommand } from './commands/runModel';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "cplex-opl-vscode" is now active!');

	const runModelDisposable = vscode.commands.registerCommand('cplex-opl-vscode.runModel', runModelCommand);

	context.subscriptions.push(runModelDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
