
function compareObjects<T>(obj1: T, obj2: T): boolean {
  // Verifica se ambos são estritamente iguais (inclui null, undefined, etc)
  if (obj1 === obj2) {
    return true;
  }

  // Se algum não for objeto ou for null, não são iguais
  if (
    typeof obj1 !== "object" || obj1 === null ||
    typeof obj2 !== "object" || obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1) as Array<keyof T>;
  const keys2 = Object.keys(obj2) as Array<keyof T>;

  // Se o número de chaves for diferente, objetos são diferentes
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Verifica se todas as chaves e valores são iguais recursivamente
  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }

    const val1 = obj1[key];
    const val2 = obj2[key];

    if (typeof val1 !== 'object' || typeof val2 !== 'object') {
      if (val1 !== val2) {
        return false;
      }
    }

    // Chamada recursiva para objetos aninhados
    if (!compareObjects(val1, val2)) {
      return false;
    }
  }

  return true;
}

export const object = {
  compare: {
    isEqual: compareObjects,
  },
}