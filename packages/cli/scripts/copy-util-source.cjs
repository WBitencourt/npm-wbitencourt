const fs = require('fs');
const path = require('path');

const sourceRoot = path.resolve(__dirname, '../../util/src');
const destinationRoot = path.resolve(__dirname, '../dist/util/src');

if (!fs.existsSync(sourceRoot)) {
  throw new Error(`Utility source directory not found: ${sourceRoot}`);
}

fs.rmSync(destinationRoot, { recursive: true, force: true });
fs.mkdirSync(path.dirname(destinationRoot), { recursive: true });
fs.cpSync(sourceRoot, destinationRoot, { recursive: true });
