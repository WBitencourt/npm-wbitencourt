# @wbitencourt/util

[![npm version](https://badge.fury.io/js/@wbitencourt/util.svg)](https://badge.fury.io/js/@wbitencourt/util)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Complete JavaScript/TypeScript utilities library for personal development

## 📋 About

`@wbitencourt/util` is a complete utilities library that offers essential features for building applications in the Brazilian context. It includes masks, validations, data handling and much more, all in one easy-to-use API.

This library was created for personal use, serving as a way to reuse and organize code in my own projects, helping to keep consistency and avoid duplication. It was not designed for public use or production outside my personal development environment, but feel free to use it if you find it helpful.

## 🚀 Installation

### NPM

```bash
npm install @wbitencourt/util
```

### Yarn

```bash
yarn add @wbitencourt/util
```

### PNPM

```bash
pnpm add @wbitencourt/util
```

## 📖 Basic Usage

```typescript
import { util } from "@wbitencourt/util";

// Mask CPF
const maskedCpf = util.mask.cpf("12345678901");
// Result: "123.456.789-01"

// Validate email
const isValidEmail = util.validation.format.email("user@example.com");
// Result: true

// Format currency
const formattedValue = util.string.format.numberBRLCurrency(1234.5);
// Result: "R$ 1.234,50"
```

## 🛠️ Available Features

### 🎭 Masks (`util.mask`)

Complete set of masks for Brazilian data:

#### Brazilian Documents

- **CPF and CNPJ** - Automatic formatting based on size
- **Legal Process Number** - Standard CNJ format
- **OAB** - Formatting with state and number
- **UUID** - Formatting with hyphens

#### Communication

- **Phone** - Brazilian format with country code
- **Email** - Cleaning and normalization

#### Values and Dates

- **Brazilian Currency (BRL)** - Formatting with R$ symbol
- **Date and Time** - Formats dd/mm/yyyy and dd/mm/yyyy hh:mm

### ✅ Validations (`util.validation`)

Specific validations for the Brazilian context:

#### Documents

- **CPF** - Validation with digit verification
- **CNPJ** - Complete validation with check digits

#### Formats

- **Email** - RFC compliant format validation
- **Date/Time** - Valid format verification

### 🔤 String Manipulation (`util.string`)

Advanced utilities for working with text:

#### Formatting

- **Brazilian Currency** - Number conversion to BRL format
- **Numbers** - Formatting with Brazilian separators

#### Transformation

- **Capitalization** - First letter uppercase
- **Truncation** - Text cutting with ellipsis

#### Utilities

- **Line Break Counting** - Text structure analysis

### 📂 File Manipulation (`util.file`)

Complete system for working with files:

#### Unit Conversion

- **To Bytes** - Conversion from different units to bytes
- **To Literal String** - Readable formatting (MB, GB, etc.)

#### Validation

- **Size Verification** - Comparison with defined limits

### 📊 Array Manipulation (`util.array`)

Efficient operations with arrays:

#### Sorting

- **Ascending** - Alphabetical/numerical increasing order
- **Descending** - Alphabetical/numerical decreasing order

#### Comparison

- **Equality** - Deep comparison of arrays

### 🏷️ Object Manipulation (`util.object`)

Utilities for working with objects:

#### Comparison

- **Deep Equality** - Recursive comparison of complex objects

### 🌐 DOM Utilities (`util.dom`)

Features for browser interaction:

#### Clipboard

- **Copy Text** - Copy to clipboard with async/await support

### 📄 Blob Manipulation (`util.blob`)

Conversion and manipulation of blobs:

#### Conversion

- **To String** - Async conversion from blob to text

### 🎨 CSS Classes (`util.classname` and `util.tailwind`)

CSS class optimization:

#### Smart Combination

- **Class Merging** - Optimized combination with Tailwind CSS
- **Conflict Resolution** - Automatic removal of conflicting classes

### 📋 Option Lists (`util.picklist`)

Structured data for forms:

#### Brazilian States

- **Complete UF List** - All states with ID, abbreviation and region

## 💡 Practical Examples

### Complete Registration Form

```typescript
import { util } from "@wbitencourt/util";

// Validate and mask CPF
const cpf = "12345678901";
if (util.validation.check.cpf(cpf)) {
  const maskedCpf = util.mask.cpf(cpf);
  console.log(`Valid CPF: ${maskedCpf}`); // "Valid CPF: 123.456.789-01"
}

// Format Brazilian phone
const phone = util.mask.phone("11987654321");
console.log(`Phone: ${phone}`); // "Phone: +55 (11) 98765-4321"

// Validate and clean email
const email = "USER@EXAMPLE.COM";
if (util.validation.format.email(email)) {
  const cleanEmail = util.mask.email(email);
  console.log(`Email: ${cleanEmail}`); // "Email: user@example.com"
}

// Select state
const states = util.picklist.uf;
const sp = states.find((uf) => uf.sigla === "SP");
console.log(`State: ${sp?.sigla} - Region: ${sp?.regiao}`); // "State: SP - Region: Sudeste"
```

### Commercial Data Processing

```typescript
// Sort client list
const clients = ["Carlos Silva", "Ana Santos", "Bruno Costa"];
const sortedClients = util.array.order.asc(clients);
console.log(sortedClients); // ['Ana Santos', 'Bruno Costa', 'Carlos Silva']

// Format sales values
const sales = [1500.75, 2340.5, 890.0];
const formattedSales = sales.map((value) =>
  util.string.format.numberBRLCurrency(value)
);
console.log(formattedSales); // ['R$ 1.500,75', 'R$ 2.340,50', 'R$ 890,00']

// Validate file size
const file = {
  size: 5,
  unit: "MB" as const,
  limit: { size: 2, unit: "MB" as const },
};

if (util.file.isSizeExceeded(file)) {
  console.log("File exceeds the allowed limit");
}
```

### Advanced Data Manipulation

```typescript
// Compare complex objects
const client1 = {
  nome: "João",
  idade: 30,
  endereco: { cidade: "São Paulo", uf: "SP" },
};

const client2 = {
  nome: "João",
  idade: 30,
  endereco: { cidade: "São Paulo", uf: "SP" },
};

const areEqual = util.object.compare.isEqual(client1, client2);
console.log(`Clients equal: ${areEqual}`); // "Clients equal: true"

// Truncate long texts
const description =
  "This is a very long description that needs to be truncated";
const truncatedDescription = util.string.truncate.textWithEllipsis(
  description,
  30
);
console.log(truncatedDescription); // "This is a very long descripti..."
```

## 🧪 Tests

The library includes a complete test suite to ensure quality and reliability:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📁 Project Structure

```
@wbitencourt/util/
├── src/
│   ├── array/          # Array manipulation
│   ├── blob/           # Blob utilities
│   ├── classname/      # CSS class combination
│   ├── dom/            # DOM utilities
│   ├── file/           # File manipulation
│   ├── mask/           # Formatting masks
│   ├── object/         # Object manipulation
│   ├── picklist/       # Option lists
│   ├── string/         # String manipulation
│   ├── tailwind/       # Tailwind CSS utilities
│   ├── validation/     # Validations
│   └── index.ts        # Main exports
├── dist/              # Compiled files
├── package.json
└── tsconfig.json
```

## 🔧 Development

### Requirements

- Node.js >= 16
- npm >= 8
- TypeScript >= 5.0

### Available Scripts

```bash
# Build the project
npm run build

# Run tests
npm run test
```

## 📊 Compatibility

- ✅ **TypeScript** - Complete support with types
- ✅ **JavaScript** - Works in pure JS projects
- ✅ **Node.js** - Compatible with server environment
- ✅ **Modern Browsers** - Support for ES2020+

## 🐛 Bug Reports

If you find any problems, please [open an issue](https://github.com/wbitencourt/npm-wbitencourt/issues).

## 🤝 Contributions

Contributions are welcome! Feel free to open a pull request.

### How to Contribute

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔗 Useful Links

- [NPM Package](https://www.npmjs.com/package/@wbitencourt/util)
- [GitHub Repository](https://github.com/wbitencourt/npm-wbitencourt)
- [API Documentation](https://github.com/wbitencourt/npm-wbitencourt/tree/main/packages/util/src)

## 📄 License

This project is licensed under the [MIT License](./LICENSE) – © 2025 Wendell Bitencourt
