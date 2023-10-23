
export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> =>
new Promise((resolve, reject) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    resolve(e.target?.result as ArrayBuffer);
  };

  reader.onerror = () => {
    const error = new Error(`Error occurred reading file: ${file.name}`);
    reject(error);
  };

  reader.readAsArrayBuffer(file);
});
