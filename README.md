# wbitencourt

This package, wbitencourt, is intended for personal use. It serves as a way to reuse and centralize code across my own projects, helping maintain consistency and avoid duplication. It is not designed for public or production use outside of my personal development environment, but feel free to use it if you find it helpful.

## 📦 Installation

### Global Installation (CLI)

```bash
npm install -g wbitencourt
```

### Project Installation

```bash
npm install wbitencourt
```

## 🚀 CLI Usage

The CLI provides commands to quickly add utilities to your projects:

### Initialize

```bash
npx wbitencourt@latest init
```

### Add Utilities

```bash
# Add mask utilities
npx wbitencourt@latest add util-mask

# Add all utilities
npx wbitencourt@latest add util-all
```

## 📚 Available Utilities

### @wbitencourt/util-mask

Input masking functions for Brazilian formats and common data types:

- **CurrencyBRL()** - Brazilian currency (R$ 0,00)
- **Cpf()** - Brazilian CPF (000.000.000-00)
- **Cnpj()** - Brazilian CNPJ (00.000.000/0000-00)
- **CpfCnpj()** - Auto-detects CPF or CNPJ format
- **NumeroProcesso()** - Brazilian legal process number
- **OAB()** - Brazilian Bar Association number (XX-000000)
- **Email()** - Email validation and formatting
- **Phone()** - Brazilian phone number (+55 (00) 00000-0000)
- **Uuid()** - UUID formatting
- **DateTime()** - Date and time formatting

## 💡 Usage Examples

### Using with CLI (copied to your project)

```typescript
import { maskCpf, maskPhone, maskCurrencyBRL } from "./src/util/mask";

// Format CPF
const cpf = maskCpf("12345678901"); // 123.456.789-01

// Format phone
const phone = maskPhone("11999887766"); // +55 (11) 99988-7766

// Format currency
const currency = maskCurrencyBRL(1234.56); // R$ 1.234,56
```

### Using as npm packages

```typescript
import { maskCpf } from "@wbitencourt/util-mask";

const formattedCpf = maskCpf("12345678901");
```

## 🏗️ Project Structure

```
wbitencourt/
├── packages/
│   ├── cli/                    # CLI tool
│   │   ├── src/
│   │   │   ├── commands/       # CLI commands (init, add)
│   │   │   ├── functions/      # CLI helper functions
│   │   │   └── index.ts        # CLI entry point
│   │   └── package.json
│   └── util/                   # Utility packages
│       └── mask/               # Masking utilities
│           ├── src/
│           │   ├── index.ts
│           │   └── *.spec.ts   # Tests
│           └── package.json
├── package.json                # Root package.json
└── README.md
```

## 🧪 Testing

```bash
npm run test
```

## 🔨 Building

```bash
npm run build
```

## 👤 Author

**Wendell Bitencourt**

- NPM: [wbitencourt](https://www.npmjs.com/package/wbitencourt)
- GitHub: [@WBitencourt](https://github.com/WBitencourt)
- Repository: [npm-wbitencourt](https://github.com/WBitencourt/npm-wbitencourt)

## 🤝 Contributing

Issues and pull requests are welcome!

## 📝 License

ISC
