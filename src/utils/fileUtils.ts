export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const createFilename = (name: string, category: string): string => {
  return `${name.replace(/\s+/g, '_')}_${category}_dossier.zip`;
};
