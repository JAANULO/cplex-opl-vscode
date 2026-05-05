import * as vscode from 'vscode';
import { getAvailableSymbols, getSymbols } from '../utils/symbols';

export function subscribeToDocumentChanges(context: vscode.ExtensionContext, oplDiagnostics: vscode.DiagnosticCollection): void {
	if (vscode.window.activeTextEditor) {
		refreshDiagnostics(vscode.window.activeTextEditor.document, oplDiagnostics);
	}
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor) {
				refreshDiagnostics(editor.document, oplDiagnostics);
			}
		})
	);

	let diagnosticTimeout: NodeJS.Timeout | undefined;
	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(e => {
			if (diagnosticTimeout) clearTimeout(diagnosticTimeout);
			diagnosticTimeout = setTimeout(() => {
				refreshDiagnostics(e.document, oplDiagnostics);
			}, 500);
		})
	);

	context.subscriptions.push(
		vscode.workspace.onDidCloseTextDocument(doc => oplDiagnostics.delete(doc.uri))
	);
}

export function refreshDiagnostics(document: vscode.TextDocument, oplDiagnostics: vscode.DiagnosticCollection): void {
	const diagnostics: vscode.Diagnostic[] = [];
	const text = document.getText();
	const lines = text.split(/\r?\n/);

	const allSymbols = getSymbols(document);
	const keywords = new Set([
		'dvar', 'dexpr', 'minimize', 'maximize', 'subject', 'to', 'constraints',
		'forall', 'sum', 'if', 'else', 'execute', 'main', 'using', 'cp', 'CP',
		'int', 'float', 'boolean', 'string', 'range', 'tuple', 'setof',
		'in', 'allDifferent', 'pack', 'pulse', 'step', 'interval', 'sequence', 'all',
		'assert', 'include', 'sorted', 'ordered', 'min', 'max', 'abs',
		'startOf', 'endOf', 'size', 'card', 'item', 'first', 'last', 'prev', 'next',
		// OPLScript / Javascript keywords
		'var', 'for', 'while', 'function', 'return', 'new', 'this', 'writeln', 'Math', 'sqrt', 'Infinity'
	]);

	// 1. Walidacja niezdefiniowanych zmiennych i duplikatów
	const identifierRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
	let match;
	while ((match = identifierRegex.exec(text)) !== null) {
		const name = match[1];
		const startPos = document.positionAt(match.index);
		const range = new vscode.Range(startPos, startPos.translate(0, name.length));

		// Pomiń słowa kluczowe
		if (keywords.has(name)) continue;

		// Pomiń identyfikatory wewnątrz komentarzy liniowych //
		const lineText = lines[startPos.line];
		const commentStart = lineText.indexOf('//');
		if (commentStart !== -1 && startPos.character >= commentStart) continue;

		// Pomiń identyfikatory wewnątrz komentarzy blokowych /* ... */
		const prefix = text.substring(0, match.index);
		const openComments = (prefix.match(/\/\*/g) || []).length;
		const closeComments = (prefix.match(/\*\//g) || []).length;
		if (openComments > closeComments) continue;

		// Pomiń identyfikatory wewnątrz stringów " " (tylko w tej samej linii)
		const currentLinePrefix = prefix.split(/\r?\n/).pop() || '';
		const quoteCount = (currentLinePrefix.match(/"/g) || []).length;
		if (quoteCount % 2 !== 0) continue;

		// Sprawdź czy to jest deklaracja czy użycie
		const isDeclaration = allSymbols.some(s => s.name === name && s.range.isEqual(range));

		if (!isDeclaration) {
			// To jest użycie — sprawdź czy zmienna jest dostępna w tym miejscu
			const available = getAvailableSymbols(document, startPos);
			if (!available.some(s => s.name === name)) {
				diagnostics.push(new vscode.Diagnostic(range, `Niezdefiniowana zmienna: '${name}'`, vscode.DiagnosticSeverity.Error));
			}
		} else {
			// To jest deklaracja — sprawdź duplikaty w tym samym zasięgu
			const mySymbol = allSymbols.find(s => s.name === name && s.range.isEqual(range))!;
			const duplicates = allSymbols.filter(s =>
				s.name === name &&
				!s.range.isEqual(range) &&
				(!s.scopeRange || !mySymbol.scopeRange || s.scopeRange.contains(mySymbol.range))
			);
			if (duplicates.length > 0) {
				diagnostics.push(new vscode.Diagnostic(range, `Zdublowany identyfikator: '${name}'`, vscode.DiagnosticSeverity.Error));
			}
		}
	}

	// 2. Inżynierskie sprawdzenia (Linearity & CP)
	// Usuwamy komentarze do analizy dyrektyw, aby uniknąć false positives w komentarzach
	const cleanText = text.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, '');
	const hasCpKeywords = /\b(pulse|step|interval|sequence|allDifferent|pack)\b/i.test(cleanText);
	const hasUsingCp = /using\s+cp\s*;/i.test(cleanText);

	if (hasCpKeywords && !hasUsingCp) {
		const range = new vscode.Range(0, 0, 0, 20);
		diagnostics.push(new vscode.Diagnostic(range, "Wykryto słowa kluczowe CP. Zalecane dodanie 'using CP;' na początku modelu.", vscode.DiagnosticSeverity.Warning));
	}

	// Prosta detekcja nieliniowości (dvar * dvar)
	const dvarNames = allSymbols.filter(s => s.type.includes('dvar')).map(s => s.name);
	if (dvarNames.length > 1) {
		const escapedDvarNames = dvarNames.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
		const linearityRegex = new RegExp(`\\b(${escapedDvarNames.join('|')})\\b\\s*\\*\\s*\\b(${escapedDvarNames.join('|')})\\b`, 'g');
		let lMatch;
		while ((lMatch = linearityRegex.exec(text)) !== null) {
			const startPos = document.positionAt(lMatch.index);
			const range = new vscode.Range(startPos, startPos.translate(0, lMatch[0].length));
			diagnostics.push(new vscode.Diagnostic(range, "Wykryto nieliniowość (mnożenie zmiennych decyzyjnych). Upewnij się, że Twój model jest poprawny dla solvera MIP.", vscode.DiagnosticSeverity.Information));
		}
	}

	lines.forEach((lineText, lineIndex) => {
		// 3. Check for missing semicolons (basic heuristic)
		const semicolonRegex = /^\s*(dvar|dexpr|range|tuple|float|int|boolean|string)\s+[^;{]+$/;
		if (semicolonRegex.test(lineText) && !lineText.trim().endsWith(';') && !lineText.trim().endsWith('{')) {
			const range = new vscode.Range(lineIndex, 0, lineIndex, lineText.length);
			diagnostics.push(new vscode.Diagnostic(range, "Brakujący średnik ';'", vscode.DiagnosticSeverity.Error));
		}
		// 3. Subject to without braces (improved check)
		if (lineText.trim().startsWith('subject to') && !lineText.includes('{')) {
			const nextLine = lines[lineIndex + 1];
			if (!nextLine || !nextLine.trim().startsWith('{')) {
				const range = new vscode.Range(lineIndex, 0, lineIndex, lineText.length);
				diagnostics.push(new vscode.Diagnostic(range, "Blok 'subject to' musi być otwarty nawiasem '{'", vscode.DiagnosticSeverity.Warning));
			}
		}
	});

	oplDiagnostics.set(document.uri, diagnostics);
}
