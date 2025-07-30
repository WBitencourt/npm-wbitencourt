# @wbitencourt/util

Uma biblioteca de utilitários JavaScript/TypeScript focada no mercado brasileiro, oferecendo funcionalidades para mascaramento de dados, validações, manipulação de arquivos, strings e muito mais.

## 📦 Instalação

```bash
npm install @wbitencourt/util
```

## 🚀 Uso Básico

```typescript
import { util } from "@wbitencourt/util";

// Mascarar CPF
const cpfMascarado = util.mask.cpf("12345678901");
// Result: "123.456.789-01"

// Validar email
const emailValido = util.validation.format.email("usuario@example.com");
// Result: true

// Formatar moeda
const valorFormatado = util.string.format.numberBRLCurrency(1234.5);
// Result: "R$ 1.234,50"
```

## 📚 Documentação

### 🎭 Máscaras (`util.mask`)

Conjunto de funções para aplicar máscaras em dados brasileiros:

#### CPF e CNPJ

```typescript
// CPF
util.mask.cpf("12345678901"); // "123.456.789-01"
util.mask.cpfCnpj("12345678901"); // "123.456.789-01"

// CNPJ
util.mask.cnpj("12345678000195"); // "12.345.678/0001-95"
util.mask.cpfCnpj("12345678000195"); // "12.345.678/0001-95"
```

#### Outros Documentos

```typescript
// Número de processo judicial
util.mask.numeroProcesso("12345678901234567890"); // "1234567-89.0123.4.56.7890"

// OAB
util.mask.oab("SP123456"); // "SP-123456"

// UUID
util.mask.uuid("550e8400e29b41d4a716446655440000"); // "550e8400-e29b-41d4-a716-446655440000"
```

#### Contato e Comunicação

```typescript
// Telefone
util.mask.phone("11987654321"); // "+55 (11) 98765-4321"

// Email (sanitização)
util.mask.email("USUARIO@EXAMPLE.COM"); // "usuario@example.com"
```

#### Valores e Datas

```typescript
// Moeda brasileira
util.mask.currencyBRL(1234.5); // "R$ 1.234,50"
util.mask.currencyBRL("123450"); // "R$ 1.234,50"

// Data e hora
util.mask.dateTime("12032024"); // "12/03/2024"
util.mask.dateTime("120320241530"); // "12/03/2024 15:30"
```

### ✅ Validações (`util.validation`)

#### Validação de Formato

```typescript
// Email
util.validation.format.email("usuario@example.com"); // true
util.validation.format.email("email-inválido"); // false
```

#### Validação de Documentos

```typescript
// CPF
util.validation.check.cpf("123.456.789-01"); // false (CPF inválido)
util.validation.check.cpf("111.444.777-35"); // true (CPF válido)

// CNPJ
util.validation.check.cnpj("12.345.678/0001-95"); // false (CNPJ inválido)

// CPF ou CNPJ automaticamente
util.validation.check.cpfCnpj("123.456.789-01"); // Valida como CPF
util.validation.check.cpfCnpj("12.345.678/0001-95"); // Valida como CNPJ
```

#### Outras Validações

```typescript
// JSON válido
util.validation.check.json('{"nome": "João"}'); // true
util.validation.check.json("json inválido"); // false

// Número
util.validation.check.number(123); // true
util.validation.check.number("123"); // false
```

### 🔤 Manipulação de Strings (`util.string`)

#### Formatação

```typescript
// Apenas números
util.string.format.stringToNumbersOnly("abc123def456"); // "123456"

// Moeda brasileira
util.string.format.numberBRLCurrency(1234.56); // "R$ 1.234,56"
util.string.format.numberBRLCurrencyNoSymbol(1234.56); // "1.234,56"
```

#### Conversões

```typescript
// Primeira letra maiúscula
util.string.convert.firstCharToUpperCase("joão silva"); // "João Silva"

// Número para literal de dias
util.string.convert.dayNumberToLiteralString(0); // "Hoje"
util.string.convert.dayNumberToLiteralString(1); // "01 dia"
util.string.convert.dayNumberToLiteralString(5); // "05 dias"

// Moeda para número
util.string.convert.brlCurrencyToNumber("R$ 1.234,56"); // 1234.56
```

#### Sanitização

```typescript
// Remover caracteres SQL perigosos
util.string.sanitize.sql("SELECT * FROM users WHERE name = 'João'");
// "SELECT * FROM users WHERE name = João"

// Remover acentos
util.string.sanitize.specialCharacters("João Ação"); // "Joao Acao"
```

#### Truncar Texto

```typescript
util.string.truncate.textWithEllipsis("Texto muito longo", 10); // "Texto muit..."
```

#### Utilitários

```typescript
// Contar quebras de linha
util.string.check.countNewlines("Linha 1\nLinha 2\nLinha 3"); // 2
```

### 📂 Manipulação de Arquivos (`util.file`)

#### Conversão de Unidades

```typescript
// Para bytes
util.file.convert.toBytes({ size: 1, unit: "MB" }); // 1048576

// Para string literal
util.file.convert.toLiteralString({
  size: 1048576,
  unit: "B",
  newUnit: "MB",
}); // "1.00 MB"
```

#### Validação de Tamanho

```typescript
const arquivo = {
  size: 5,
  unit: "MB",
  limit: {
    size: 2,
    unit: "MB",
  },
};

util.file.isSizeExceeded(arquivo); // true
```

### 📊 Arrays (`util.array`)

#### Ordenação

```typescript
const nomes = ["Carlos", "Ana", "Bruno"];

util.array.order.asc(nomes); // ['Ana', 'Bruno', 'Carlos']
util.array.order.desc(nomes); // ['Carlos', 'Bruno', 'Ana']
```

#### Comparação

```typescript
const array1 = [1, 2, 3];
const array2 = [1, 2, 3];
const array3 = [3, 2, 1];

util.array.compare.isEqual(array1, array2); // true
util.array.compare.isEqual(array1, array3); // false
```

### 🏷️ Objetos (`util.object`)

#### Comparação Profunda

```typescript
const obj1 = { nome: "João", idade: 30, endereco: { cidade: "São Paulo" } };
const obj2 = { nome: "João", idade: 30, endereco: { cidade: "São Paulo" } };
const obj3 = { nome: "Maria", idade: 25 };

util.object.compare.isEqual(obj1, obj2); // true
util.object.compare.isEqual(obj1, obj3); // false
```

### 🌐 DOM (`util.dom`)

#### Área de Transferência

```typescript
// Copiar texto para área de transferência
await util.dom.copyClipBoard("Texto para copiar");
```

### 📄 Blob (`util.blob`)

#### Conversão

```typescript
// Converter Blob para string
const texto = await util.blob.convert.toString(meuBlob);
```

### 🎨 Classes CSS (`util.classname`)

#### Combinação de Classes

```typescript
// Combina classes com Tailwind CSS
util.classname.cn("px-4 py-2", "bg-blue-500", "text-white");
// Resultado otimizado e sem conflitos
```

### 🎨 Tailwind CSS (`util.tailwind`)

```typescript
// Função auxiliar para Tailwind CSS
util.tailwind.cn("px-4 py-2", "bg-blue-500", "text-white");
```

### 📋 Listas de Opções (`util.picklist`)

#### Estados Brasileiros

```typescript
util.picklist.uf;
// Retorna array completo com todos os estados brasileiros:
// [
//   { id: '12', sigla: 'AC', regiao: 'Norte' },
//   { id: '27', sigla: 'AL', regiao: 'Nordeste' },
//   // ... todos os estados
// ]
```

## 🧪 Testes

O pacote inclui testes abrangentes para todas as funcionalidades principais:

```bash
npm test
```

## 📝 Exemplos Práticos

### Formulário de Cadastro

```typescript
import { util } from "@wbitencourt/util";

// Validar e mascarar CPF
const cpf = "12345678901";
if (util.validation.check.cpf(cpf)) {
  const cpfMascarado = util.mask.cpf(cpf);
  console.log(cpfMascarado); // "123.456.789-01"
}

// Formatar telefone
const telefone = util.mask.phone("11987654321");
console.log(telefone); // "+55 (11) 98765-4321"

// Validar email
const email = "usuario@example.com";
if (util.validation.format.email(email)) {
  const emailLimpo = util.mask.email(email);
  console.log(emailLimpo); // "usuario@example.com"
}
```

### Processamento de Dados

```typescript
// Ordenar lista de nomes
const clientes = ["Carlos Silva", "Ana Santos", "Bruno Costa"];
const clientesOrdenados = util.array.order.asc(clientes);

// Formatar valores monetários
const vendas = [1500.75, 2340.5, 890.0];
const vendasFormatadas = vendas.map((valor) =>
  util.string.format.numberBRLCurrency(valor)
);
```

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## 🔗 Links Úteis

- [NPM Package](https://www.npmjs.com/package/@wbitencourt/util)
- [GitHub Repository](https://github.com/wbitencourt/npm-wbitencourt)

## 📄 Licença

Este projeto está sob a licença MIT.
