function isValidBRLCurrencyFormat (value: string | number | undefined): boolean {
  if (typeof value !== 'string') return false;

  const brlCurrencyRegexSpecialSpace = /^R\$ ?\d{1,3}(\.\d{3})*(,\d{2})?$/;

  const brlCurrencyRegexNormalSpace = /^R\$ ?\d{1,3}(\.\d{3})*(,\d{2})?$/;

  return brlCurrencyRegexSpecialSpace.test(value) || brlCurrencyRegexNormalSpace.test(value);
};

function formatNumberBRLCurrency (value: string | number | undefined) {
  if (!value) {
    return 'R$ 0,00';
  }

  if (isValidBRLCurrencyFormat(value)) {
    return value as string;
  }

  const numericValue = typeof value === 'number' ? value : parseFloat(value);

  const formattedNUmber = numericValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });

  if (!isValidBRLCurrencyFormat(formattedNUmber)) {
    return 'R$ 0,00';
  }

  return formattedNUmber;
};

function formatBRLCurrencyNoSymbol (value: string | number | undefined) {
  if (!value) return '0,00';

  if (value === 0) return '0,00';

  const numericValue = parseFloat(value.toString()); // Sem divisão por 100, pois o valor já está em reais

  const formattedNUmber = numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
  });

  if (formattedNUmber === 'NaN') {
    return '0,00';
  }

  return formattedNUmber;
}

function formatStringToNumbersOnly(text: string | undefined) {
  if(!text) {
    return '';
  }
  
  const regex = /\d+/g;

  return text.match(regex)?.join('') ?? text;
}

function convertFirstCharToUpperCase(value: string | undefined) {
  if (!value) {
    return '';
  }

  const words = value.split(' ');

  const capitalizedWords = words.map((word) => {
    if (word.length === 0) {
      return word; // Mantenha palavras vazias inalteradas
    }
    const firstCharacter = word.charAt(0).toUpperCase();
    const remainingString = word.slice(1);
    return firstCharacter + remainingString;
  });

  const result = capitalizedWords.join(' ');

  return result;
}

function convertDayNumberToLiteralString (day: string | number | undefined) {
  if(Number.isNaN(day)) {
    return '';
  }

  const dayNumber = Number(day);

  if(dayNumber === 0) {
    return 'Hoje';
  }

  if(dayNumber === 1) {
    return `${dayNumber.toString().padStart(2, '0')} dia`;
  }

  if(dayNumber >= 2) {
    return `${dayNumber.toString().padStart(2, '0')} dias`;
  }

  return ''
}

function countNewlines(text: string | undefined) {
  if (!text) {
    return 0;
  }

  let newlineCount = 0; // \n

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\n') {
      newlineCount++;
    }
  }

  return newlineCount;
}

function convertBRLCurrencyToNumber (currency: string | undefined | null) {
  if (typeof currency !== 'string' || currency.trim().length === 0) {
    return 0;
  }

  const sanitized = currency.replace(/[^\d,]/g, '').replace(/\./g, '').replace(',', '.');

  return parseFloat(sanitized);
}

function truncateTextWithEllipsis(text: string | undefined, size: number) {
  if (!text || size === 0) {
    return '';
  }

  const trimmedText = text.trim();
  const shouldAddEllipsis = size < trimmedText.length;
  const limitedText = trimmedText.substring(0, size);

  return `${limitedText}${shouldAddEllipsis ? '...' : ''}`;
}

function sanitizeTextSQL(text: string) {
  const regex = /[']|["]|[´]|[`]/gi;

  return text.replace(regex, '');
}

function sanitizeTextSpecialCharacters (text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export const string = {
  format: {
    stringToNumbersOnly: formatStringToNumbersOnly,
    numberBRLCurrency: formatNumberBRLCurrency,
    numberBRLCurrencyNoSymbol: formatBRLCurrencyNoSymbol,
  },
  convert: {
    firstCharToUpperCase: convertFirstCharToUpperCase,
    dayNumberToLiteralString: convertDayNumberToLiteralString,
    brlCurrencyToNumber: convertBRLCurrencyToNumber,
    numberToBRLCurrency: formatNumberBRLCurrency,
    numberToBRLCurrencyNoSymbol: formatBRLCurrencyNoSymbol,
  },
  sanitize: {
    sql: sanitizeTextSQL,
    specialCharacters: sanitizeTextSpecialCharacters,
  },
  truncate: {
    textWithEllipsis: truncateTextWithEllipsis,
  },
  check: {
    countNewlines,
  }
}

