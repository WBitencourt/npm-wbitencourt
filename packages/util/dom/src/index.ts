async function copyClipBoard(value: string | undefined) {
  try {
    await navigator.clipboard.writeText(value ?? '');
  } catch {
    throw new Error('Failed to copy to clipboard');
  }
};

export const dom = {
  copyClipBoard,
}