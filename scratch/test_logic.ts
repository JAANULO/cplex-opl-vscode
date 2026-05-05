// Symulacja logiki diagnostycznej i autouzupełniania dla OPL
const testCode = `
dvar int x;
dvar float y
dvar int x;
subject to
{
    x + y <= 10
}
`;

function testDiagnostics(text: string) {
    console.log("--- Test Diagnostyki ---");
    const lines = text.split(/\r?\n/);
    const seenNames = new Map<string, number>();

    lines.forEach((lineText, lineIndex) => {
        // 1. Średniki
        const semicolonRegex = /^\s*(dvar|dexpr|range|tuple|float|int|boolean|string)\s+[^;{]+$/;
        if (semicolonRegex.test(lineText) && !lineText.trim().endsWith(';') && !lineText.trim().endsWith('{')) {
            console.log(`[BŁĄD] Linia ${lineIndex + 1}: Brakujący średnik w: "${lineText.trim()}"`);
        }

        // 2. Duplikaty
        const varNameRegex = /^\s*(dvar\s+(?:int|float|boolean)(?:\+|)|range|tuple|float|int|boolean|string)\s+([a-zA-Z_][a-zA-Z0-9_]*)/;
        const match = varNameRegex.exec(lineText);
        if (match) {
            const name = match[2];
            if (seenNames.has(name)) {
                console.log(`[BŁĄD] Linia ${lineIndex + 1}: Zdublowany identyfikator: '${name}'`);
            } else {
                seenNames.set(name, lineIndex);
            }
        }
    });
}

function testAutocomplete(text: string) {
    console.log("\n--- Test Autouzupełniania ---");
    const varRegex = /^\s*(dvar\s+(?:int|float|boolean)(?:\+|)|range|tuple|float|int|boolean|string)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gm;
    let match;
    const foundVariables = [];
    while ((match = varRegex.exec(text)) !== null) {
        foundVariables.push(match[2]);
    }
    console.log("Znalezione zmienne do podpowiedzi:", foundVariables);
}

testDiagnostics(testCode);
testAutocomplete(testCode);
