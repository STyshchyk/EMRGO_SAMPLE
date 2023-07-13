export const convertToBase64 = (file: File | null) => {
  //Handle convert to base64
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    if (!file)return reject("No file");
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
