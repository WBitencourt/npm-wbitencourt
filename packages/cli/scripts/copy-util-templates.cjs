const fs = require('fs');
const path = require('path');

const sourceRoot = path.resolve(__dirname, '../../util/src');
const destinationRoot = path.resolve(__dirname, '../dist/templates/util');

fs.rmSync(destinationRoot, { recursive: true, force: true });

fs.cpSync(sourceRoot, destinationRoot, {
  recursive: true,
  filter: (source) => !source.endsWith('.spec.ts'),
});
