// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { runModelCommand } from './commands/runModel';
import { OplCompletionItemProvider } from './providers/completion';
import { OplDocumentSymbolProvider } from './providers/symbol';
import { OplDocumentFormattingEditProvider } from './providers/formatter';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "cplex-opl-vscode" is now active!');

	const runModelDisposable = vscode.commands.registerCommand('cplex-opl-vscode.runModel', runModelCommand);
	context.subscriptions.push(runModelDisposable);

	// Register Code Intelligence Providers
	const documentSelector: vscode.DocumentSelector = { scheme: 'file', language: 'opl' };

	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(documentSelector, new OplCompletionItemProvider(), ' ', '.')
	);

	context.subscriptions.push(
		vscode.languages.registerDocumentSymbolProvider(documentSelector, new OplDocumentSymbolProvider())
	);

	context.subscriptions.push(
		vscode.languages.registerDocumentFormattingEditProvider(documentSelector, new OplDocumentFormattingEditProvider())
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
