// Esegui: node tools/find-js-duplicates.js
const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const walk = require('acorn-walk');

const dir = path.join(__dirname, '..', 'wwwroot', 'Travel');
const outputFile = path.join(__dirname, 'find-js-duplicates-output.txt');
const names = new Map();

function addName(name, file, line) {
    if (!name) return;
    const key = name.toString();
    if (!names.has(key)) names.set(key, []);
    names.get(key).push({ file, line });
}

function processFile(full) {
    const src = fs.readFileSync(full, 'utf8');
    try {
        const ast = acorn.parse(src, { ecmaVersion: 2020, sourceType: 'module', locations: true });
        walk.simple(ast, {
            FunctionDeclaration(node) {
                const n = node.id && node.id.name;
                addName(n, full, node.loc.start.line);
            },
            VariableDeclarator(node) {
                if (node.id && node.id.type === 'Identifier' && node.init) {
                    if (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression') {
                        addName(node.id.name, full, node.loc.start.line);
                    }
                }
            },
            AssignmentExpression(node) {
                let leftName = null;
                if (node.left.type === 'Identifier') {
                    leftName = node.left.name;
                } else if (node.left.type === 'MemberExpression') {
                    if (node.left.property && node.left.property.type === 'Identifier') {
                        const owner = node.left.object && node.left.object.type === 'Identifier' ? node.left.object.name : '<obj>';
                        leftName = `${owner}.${node.left.property.name}`;
                    }
                }
                if (leftName && node.right && (node.right.type === 'FunctionExpression' || node.right.type === 'ArrowFunctionExpression')) {
                    addName(leftName, full, node.loc.start.line);
                }
            },
            ExportNamedDeclaration(node) {
                if (node.declaration && node.declaration.type === 'FunctionDeclaration') {
                    const n = node.declaration.id && node.declaration.id.name;
                    addName(n, full, node.declaration.loc.start.line);
                }
            }
        });
    } catch (e) {
        console.warn(`Parsing failed for ${full}: ${e.message}`);
    }
}

function walkDir(d) {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, f.name);
        if (f.isDirectory()) walkDir(full);
        else if (f.isFile() && f.name.endsWith('.js')) {
            processFile(full);
        }
    }
}

walkDir(dir);

// Prepara l'output
const outputLines = [];
let found = false;
for (const [name, occurrences] of Array.from(names.entries()).sort((a, b) => b[1].length - a[1].length)) {
    const uniqueFiles = new Set(occurrences.map(o => o.file));
    if (occurrences.length > 1) {
        found = true;
        outputLines.push(`${name} -> ${occurrences.length} occorrenze (${uniqueFiles.size} file):`);
        for (const occ of occurrences) {
            outputLines.push(`  - ${occ.file}:${occ.line}`);
        }
        outputLines.push(''); // blank line fra gruppi
    }
}

if (!found) {
    outputLines.push('Nessuna funzione duplicata trovata nella cartella wwwroot/Travel.');
}

// Scrive risultato su file .txt
try {
    fs.writeFileSync(outputFile, outputLines.join('\n'), 'utf8');
    console.log(`Risultato salvato in: ${outputFile}`);
} catch (e) {
    console.error('Errore scrittura file:', e.message);
}

// Stampa anche a console per immediatezza
if (outputLines.length > 0) {
    console.log(outputLines.join('\n'));
}