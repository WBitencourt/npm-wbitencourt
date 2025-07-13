function convertBlobToString(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const content = reader.result as string;
      resolve(content);
    };

    reader.onerror = () => {
      reject(new Error('Failed to convert blob to string.'));
    };

    reader.readAsText(file);
  });
}

export const blob = {
  convert: {
    toString: convertBlobToString
  }
}
