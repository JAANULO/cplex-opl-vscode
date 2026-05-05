// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { runModelCommand } from './commands/runModel';
import { generateDatSkeletonCommand } from './commands/generateDat';
import { OplCompletionItemProvider } from './providers/completion';
import { OplDocumentSymbolProvider } from './providers/symbol';
import { OplDocumentFormattingEditProvider } from './providers/formatter';
import { subscribeToDocumentChanges } from './providers/diagnostics';
import { OplDefinitionProvider } from './providers/definition';
import { OplReferenceProvider } from './providers/references';
import { OplHoverProvider } from './providers/hover';
import { OplRenameProvider } from './providers/rename';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "cplex-opl-vscode" is now active!');

	context.subscriptions.push(vscode.commands.registerCommand('cplex-opl-vscode.runModel', runModelCommand));
	context.subscriptions.push(vscode.commands.registerCommand('cplex-opl-vscode.generateDatSkeleton', generateDatSkeletonCommand));

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

	context.subscriptions.push(
		vscode.languages.registerDefinitionProvider(documentSelector, new OplDefinitionProvider())
	);

	context.subscriptions.push(
		vscode.languages.registerReferenceProvider(documentSelector, new OplReferenceProvider())
	);

	context.subscriptions.push(
		vscode.languages.registerHoverProvider(documentSelector, new OplHoverProvider())
	);

	context.subscriptions.push(
		vscode.languages.registerRenameProvider(documentSelector, new OplRenameProvider())
	);

	const oplDiagnostics = vscode.languages.createDiagnosticCollection("opl");
	context.subscriptions.push(oplDiagnostics);

	subscribeToDocumentChanges(context, oplDiagnostics);
}

// This method is called when your extension is deactivated
export function deactivate() {}
