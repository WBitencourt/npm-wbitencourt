import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commandToDir: Record<string, string> = {
  'util-array': 'array',
  'util-blob': 'blob',
  'util-classname': 'classname',
  'util-dom': 'dom',
  'util-file': 'file',
  'util-mask': 'mask',
  'util-object': 'object',
  'util-picklist': 'picklist',
  'util-string': 'string',
  'util-tailwind': 'tailwind',
  'util-validation': 'validation',
};

async function getAvailableTemplateDirs(templatesRoot: string) {
  const entries = await fs.readdir(templatesRoot, { withFileTypes: true });
  const dirs: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const templateDir = path.join(templatesRoot, entry.name);

    if (await fs.pathExists(path.join(templateDir, 'index.ts'))) {
      dirs.push(entry.name);
    }
  }

  return dirs.sort();
}

async function assertCanCopy(copies: Array<{ from: string; to: string; dir: string }>) {
  for (const copy of copies) {
    if (!await fs.pathExists(copy.from)) {
      throw new Error(`Template "${copy.dir}" was not found in the installed package.`);
    }

    if (await fs.pathExists(copy.to)) {
      throw new Error(`Destination src/util/${copy.dir} already exists.`);
    }
  }
}

export async function addToClient(command: string) {
  const templatesRoot = process.env.WBITENCOURT_TEMPLATES_ROOT ?? path.resolve(__dirname, '../templates');
  const destRoot = process.cwd();
  let dirs: string[];

  if (command === 'util-all') {
    dirs = await getAvailableTemplateDirs(templatesRoot);
  } else if (commandToDir[command]) {
    dirs = [commandToDir[command]];
  } else {
    throw new Error(`add command "${command}" not recognized.`);
  }

  const copies = dirs.map((dir) => ({
    dir,
    from: path.join(templatesRoot, dir),
    to: path.join(destRoot, 'src/util', dir),
  }));

  await assertCanCopy(copies);

  for (const copy of copies) {
    await fs.copy(copy.from, copy.to);
    console.log(chalk.green(`${copy.dir} copied to src/util/${copy.dir}`));
  }
}