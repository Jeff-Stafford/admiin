export const downloadBlob = async (blob: Blob, filename: string) => {
  if (!(blob instanceof Blob)) return;
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
