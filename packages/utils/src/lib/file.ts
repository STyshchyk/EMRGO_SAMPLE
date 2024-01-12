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

export const BytesFormmater = (bytes: string, decimals = 2) => {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
export const BytesToMb = (bytes: string | number): number | string => {
  return (Math.log(parseFloat(bytes)) / Math.log(1024)).toFixed(2);
};
