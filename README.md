# 📦 npm-wbitencourt

A personal monorepo containing NPM tools and utilities developed by **Wendell Bitencourt** for personal use, projects and learning.

## 📋 About the Repository

This repository represents my learning journey and development of tools that I use frequently in my projects. It is a space where I organize utilities, helper functions and CLI tools that make my daily work as a developer easier.

### 🎯 Goals

- **Learning**: Explore advanced TypeScript concepts, monorepo management and NPM package publishing
- **Reuse**: Centralize useful code that can be reused in different projects
- **Experimentation**: Test new ideas and development approaches
- **Productivity**: Create tools that speed up my workflow

## 📦 Included Packages

### 🛠️ CLI Tool (`wbitencourt`)

A custom command line tool with development utilities.

**Main commands:**

- `init` - Project initialization
- `add` - Adding resources/dependencies
- `version` - Version management

### 🔧 Utilities (`@wbitencourt/util`)

A complete library of utility functions for use in JavaScript/TypeScript projects.

**Utility categories:**

- **Array** - Array manipulation and operations
- **Blob** - Working with files and binary data
- **Classname** - Utilities for CSS classes
- **DOM** - DOM element manipulation
- **File** - File operations
- **Mask** - Masks for data formatting (CPF, CNPJ, phone, etc.)
- **String** - String manipulation
- **Tailwind** - Utilities for Tailwind CSS
- **Validation** - Validation functions

## 🏗️ Project Structure

```
npm-wbitencourt/
├── packages/
│   ├── cli/          # Command line tool
│   └── util/         # Utilities library
├── preview/          # Examples and usage tests
├── package.json      # Workspace configuration
└── README.md         # This file
```

## 🔧 Development

This project uses **npm workspaces** to manage multiple packages in a single repository.

### Main commands:

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test

# Publish packages to npm
./deploy.sh
```

## 📚 Detailed Documentation

For specific information about each package, check:

- [CLI Documentation](./packages/cli/README.md)
- [Utilities Documentation](./packages/util/README.md)

## 🤝 Contributions

This is a personal project focused on learning. While it is not open for external contributions at the moment, feel free to:

- Explore the code
- Use it as reference for your own projects
- Report bugs or suggestions through [Issues](https://github.com/WBitencourt/npm-wbitencourt/issues)

## 📄 License

This project is licensed under the [MIT License](https://github.com/WBitencourt/npm-wbitencourt/blob/master/LICENSE) – © 2025 Wendell Bitencourt


