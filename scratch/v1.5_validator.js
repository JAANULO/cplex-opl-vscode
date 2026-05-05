const fs = require('fs');
const path = require('path');

function validateFile(filePath) {
    const text = fs.readFileSync(filePath, 'utf8');
    const lines = text.split(/\r?\n/);
    console.log(`\n--- Walidacja: ${path.basename(filePath)} ---`);

    const symbols = [];
    const globalVarRegex = /^\s*(dvar\s+(?:int|float|boolean|boolean\+)(?:\+|)|range|tuple|float|int|boolean|string|dexpr|setof\s*(?:<[^>]+>|))\s+([a-zA-Z_][a-zA-Z0-9_]*)/gm;
    let match;
    while ((match = globalVarRegex.exec(text)) !== null) {
        symbols.push({ name: match[2], type: match[1] });
    }

    const cleanText = text.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, '');
    const hasCpKeywords = /\b(pulse|step|interval|sequence|allDifferent|pack)\b/i.test(cleanText);
    const hasUsingCp = /using\s+cp\s*;/i.test(cleanText);

    if (hasCpKeywords && !hasUsingCp) {
        console.log("[WARNING] Wykryto słowa kluczowe CP bez 'using CP;'.");
    }

    const dvarNames = symbols.filter(s => s.type.includes('dvar') || s.type === 'dexpr').map(s => s.name);
    if (dvarNames.length > 1) {
        const escapedDvarNames = dvarNames.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const linearityRegex = new RegExp(`\\b(${escapedDvarNames.join('|')})\\b\\s*\\*\\s*\\b(${escapedDvarNames.join('|')})\\b`, 'g');
        let lMatch;
        while ((lMatch = linearityRegex.exec(text)) !== null) {
            console.log(`[INFO] Wykryto nieliniowość: "${lMatch[0]}"`);
        }
    }

    const keywords = new Set([
        'dvar', 'dexpr', 'minimize', 'maximize', 'subject', 'to', 'constraints',
        'forall', 'sum', 'if', 'else', 'execute', 'main', 'using', 'cp', 'CP',
        'int', 'float', 'boolean', 'string', 'range', 'tuple', 'setof', 'key',
        'in', 'allDifferent', 'pack', 'pulse', 'step', 'interval', 'sequence', 'all',
        'assert', 'include', 'sorted', 'ordered', 'min', 'max', 'abs',
        'startOf', 'endOf', 'size', 'card', 'item', 'first', 'last', 'prev', 'next',
        'var', 'for', 'while', 'function', 'return', 'new', 'this', 'writeln', 'Math', 'sqrt', 'Infinity'
    ]);
    
    const mocks = [
        'i', 'j', 'k', 'total', 'limit', 'p', 'temp', 'obj', 'thisOplModel', 'cp', 'm', 'cost', 'Workers', 'Capacity', 'Items', 'Value', 'Weight', 'Take', 'FixedCost', 'Warehouses', 'Stores', 'Demand', 'Distances', 'Open', 'Supply', 'n', 'Dist', 'x', 'u', 'Dist',
        'Alloys', 'Aloys', 'Elements', 'RawMaterialCost', 'Composition', 'MinElement', 'MaxElement', 'Mix', 'Range', 'InitGrid', 'Nurses', 'Days', 'Shifts', 'MinNursesPerShift', 'Assets', 'ExpectedReturn', 'MinReturn', 'Allocation', 'Nodes', 'Arc', 'Arcs', 'Flow', 'fromNode', 'toNode'
    ];

    const identifierRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
    while ((match = identifierRegex.exec(text)) !== null) {
        const name = match[1];
        if (keywords.has(name)) continue;
        const prefix = text.substring(0, match.index);
        const lastLine = prefix.split('\n').pop();
        if (lastLine.includes('//')) continue;

        if (!symbols.some(s => s.name === name) && !mocks.includes(name)) {
            console.error(`[ERROR] Prawdopodobnie niezdefiniowana zmienna: '${name}'`);
        }
    }
}

const files = [
    './tests_manual/linearity_test.mod',
    './tests_manual/scope_test.mod',
    './tests_manual/smart_run_test.mod',
    './tests_manual/sets_tuples_test.mod',
    './tests_manual/scripting_test.mod',
    './tests_manual/data_init_test.mod',
    './tests_manual/complex_constraints.mod',
    './tests_manual/knapsack.mod',
    './tests_manual/warehouse.mod',
    './tests_manual/tsp_mtz.mod',
    './tests_manual/blending.mod',
    './tests_manual/sudoku.mod',
    './tests_manual/nurse_scheduling.mod',
    './tests_manual/portfolio.mod',
    './tests_manual/min_cost_flow.mod'
];

files.forEach(f => {
    if (fs.existsSync(f)) {
        validateFile(f);
    } else {
        console.error(`Plik nie istnieje: ${f}`);
    }
});
