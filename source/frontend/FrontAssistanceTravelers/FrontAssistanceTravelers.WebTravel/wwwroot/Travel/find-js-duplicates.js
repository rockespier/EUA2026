// Esegui: node tools/find-js-duplicates.js
const fs = require('fs');
const path = require('path');
const acorn = require('acorn');

const dir = path.join(__dirname, '..', 'wwwroot', 'Travel');
const names = {};

function walkDir(d) {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
        const full = path.join(d, f.name);
        if (f.isDirectory()) walkDir(full);
        else if (f.isFile() && f.name.endsWith('.js')) {
            const src = fs.readFileSync(full, 'utf8');
            try {
                const ast = acorn.parse(src, { ecmaVersion: 2020, sourceType: 'module' });
                acorn.walk = require('acorn-walk');
                acorn.walk.simple(ast, {
                    FunctionDeclaration(node) {
                        const n = node.id && node.id.name;
                        if (n) (names[n] = names[n] || new Set()).add(full);
                    },
                    VariableDeclarator(node) {
                        if (node.init && (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')) {
                            const n = node.id.name;
                            if (n) (names[n] = names[n] || new Set()).add(full);
                        }
                    },
                    AssignmentExpression(node) {
                        if (node.right && (node.right.type === 'ArrowFunctionExpression' || node.right.type === 'FunctionExpression')) {
                            if (node.left.type === 'Identifier') {
                                const n = node.left.name;
                                if (n) (names[n] = names[n] || new Set()).add(full);
                            }
                        }
                    }
                });
            } catch (e) {
                console.warn(`Parsing failed for ${full}: ${e.message}`);
            }
        }
    }
}

walkDir(dir);

for (const [name, setFiles] of Object.entries(names).sort((a, b) => b[1].size - a[1].size)) {
    if (setFiles.size > 1) {
        console.log(`${name} -> ${Array.from(setFiles).join('; ')}`);
    }
}