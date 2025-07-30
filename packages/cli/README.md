# @wbitencourt/cli

[![npm version](https://badge.fury.io/js/wbitencourt.svg)](https://badge.fury.io/js/wbitencourt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> CLI for installing and managing reusable utilities by Wendell Bitencourt

## 📋 About

`wbitencourt` is a command-line tool that allows you to easily install JavaScript/TypeScript utilities in your projects. With it, you can add specific modules or all utilities at once, copying files directly to your project structure.

This project is intended for personal use, serving as a way to reuse and centralize code in my own projects, helping to maintain consistency and avoid duplication. It was not designed for public use or production outside my personal development environment, but feel free to use it if you find it useful.

## 🚀 Installation

### Global installation

```bash
npm install -g wbitencourt
```

### Usage without installation (recommended)

```bash
npx wbitencourt@latest <command>
```

## 📖 Available Commands

### `init`

Initializes the project and shows a welcome message.

```bash
npx wbitencourt@latest init
```

### `add <utility>`

Adds a specific utility to your project.

```bash
npx wbitencourt@latest add <utility-name>
```

#### Available Utilities:

- **`util-array`** - Functions for array manipulation
- **`util-blob`** - Utilities for working with blobs
- **`util-classname`** - Helpers for CSS class concatenation
- **`util-dom`** - Functions for DOM manipulation
- **`util-file`** - Utilities for file handling and unit conversion
- **`util-mask`** - Masks for formatting (CPF, CNPJ, phone, currency, etc.)
- **`util-string`** - Functions for string manipulation
- **`util-tailwind`** - Utilities for Tailwind CSS
- **`util-validation`** - Validation functions (email, CPF, CNPJ, etc.)
- **`util-all`** - Installs all utilities at once

#### Examples:

```bash
# Add only mask utilities
npx wbitencourt@latest add util-mask

# Add validation utilities
npx wbitencourt@latest add util-validation

# Add all utilities
npx wbitencourt@latest add util-all
```

### `version`

Shows package version information.

```bash
npx wbitencourt@latest version
```

## 📁 File Structure

When you run the `add` command, files are copied to the following structure in your project:

```
your-project/
└── src/
    └── util/
        ├── array/
        ├── blob/
        ├── classname/
        ├── dom/
        ├── file/
        ├── mask/
        ├── string/
        ├── tailwind/
        └── validation/
```

## 🛠️ Utility Features

### Masks (`util-mask`)

- CPF and CNPJ formatting
- Phone masks
- Brazilian currency formatting (BRL)
- Date and time masks
- Date/time format validation
- And much more...

### Validations (`util-validation`)

- Email validation
- CPF validation
- CNPJ validation
- And other common validations

### Files (`util-file`)

- Storage unit conversion
- File size limit verification
- Conversion to bytes
- Literal size formatting

### And more...

Each utility contains specific functions for its area of operation.

## 💡 Usage Example

```bash
# 1. Navigate to your project
cd your-project

# 2. Add mask utilities
npx wbitencourt@latest add util-mask

# 3. Use in your code
import { mask } from './src/util/mask';

const formattedCpf = mask.maskCpf('12345678901');

console.log(formattedCpf); // 123.456.789-01
```

## 🔧 Development

### Prerequisites

- Node.js >= 16
- npm >= 8

### Project Structure

```
packages/cli/
├── src/
│   ├── commands/     # Available commands
│   ├── functions/    # Helper functions
│   └── index.ts      # Entry point
├── package.json
└── tsconfig.json
```

## 🐛 Report Bugs

If you find any issues, please [open an issue](https://github.com/WBitencourt/npm-wbitencourt/issues).

## 🤝 Contributions

Contributions are welcome! Feel free to open a pull request.

## 📄 License

This project is licensed under the [MIT License](https://github.com/WBitencourt/npm-wbitencourt/blob/master/LICENSE) – © 2025 Wendell Bitencourt
