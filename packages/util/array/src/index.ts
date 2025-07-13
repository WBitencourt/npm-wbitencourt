function sumByObjectKey<T>(array: T[], key: keyof T) {
  const initialValues = { sum: 0 };

  const result = array.reduce((previousValue, object: T) => {
    previousValue.sum += typeof object[key] === 'number' ? object[key] as number : 0;

    return previousValue;
  }, initialValues);

  return result.sum;
}

function orderAsc<T>(array: T[]) {
  if(!array) return [];

  if(array.length === 0) return [];

  const orderedArray = array.sort((a, b) => {
    const aValue = typeof a === 'string' ? a.toLowerCase() : String(a).toLowerCase();
    const bValue = typeof b === 'string' ? b.toLowerCase() : String(b).toLowerCase();

    if(aValue > bValue) return 1;
    if(aValue < bValue) return -1;

    return 0;
  });

  return orderedArray;
}

function orderDesc<T>(array: T[]) {
  if(!array) return [];

  if(array.length === 0) return [];

  const orderedArray = array.sort((a, b) => {
    const aValue = typeof a === 'string' ? a.toLowerCase() : String(a).toLowerCase();
    const bValue = typeof b === 'string' ? b.toLowerCase() : String(b).toLowerCase();

    if(aValue < bValue) return 1;
    if(aValue > bValue) return -1;

    return 0;
  });

  return orderedArray;
}

function isEqual(a: unknown[], b: unknown[]) {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;

  return a.every((item, index) => {
    const other = b[index];

    // Comparação simples por valor
    if (typeof item !== 'object' || item === null) {
      return item === other;
    }

    // Comparação profunda para objetos
    return JSON.stringify(item) === JSON.stringify(other);
  });
};

export const array = {
  order: {
    asc: orderAsc,
    desc: orderDesc
  },
  compare: {
    isEqual: isEqual
  }
}

