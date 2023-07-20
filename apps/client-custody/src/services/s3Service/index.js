import axios from "axios";

import appConfig from "../../appConfig";

const AWS_S3_REGEXP = /^(s3)\.([\wd-]+)\.(amazonaws)\.com$/i;
const OCI_OBJ_STORAGE_REGEXP = /^(objectstorage)\.([\wd-]+)\.(oraclecloud)\.com$/i;

const readFileAsArrayBuffer = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve(e.target?.result);
    };

    reader.onerror = () => {
      const error = new Error(`Error occurred reading file: ${file.name}`);

      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });

// TODO: Type annotate this function with TS
// NOTE:
// uploadURLData argument should be an object with the following fields:
// url: string
// fields: object (Optional)

// eslint-disable-next-line import/prefer-default-export
export const putFile = async ({ uploadURLData, file }) => {
  try {
    const { url } = uploadURLData;
    const parsedUrl = new URL(url);

    const isValidAWSPresignedURL = AWS_S3_REGEXP.test(parsedUrl.hostname);
    const isValidOCIPARURL = OCI_OBJ_STORAGE_REGEXP.test(parsedUrl.hostname);

    // Check if parsed preauthenticated URL's hostname is valid
    if (!(isValidAWSPresignedURL || isValidOCIPARURL)) {
      throw new Error("Preauthenticated S3 Put URL is invalid");
    }

    const formData = new FormData();
    let s3PutAPIResponse;

    const sharedAxiosRequestConfig = {
      withCredentials: false,
      url,
    };

    if (isValidAWSPresignedURL) {
      if (!uploadURLData?.fields) {
        throw new Error("AWS Fields are required");
      }

      const { fields } = uploadURLData;

      Object.keys(fields).forEach((fieldKeyName) => {
        formData.append(fieldKeyName, fields[fieldKeyName]);
      });

      formData.append("file", file);

      const awsS3APIResponse = await axios({
        ...sharedAxiosRequestConfig,
        headers: { "Content-Type": "multipart/form-data" },
        method: "POST",
        data: formData,
      });

      if (awsS3APIResponse.status !== 204) {
        throw new Error("AWS S3 Upload Failed");
      }

      s3PutAPIResponse = awsS3APIResponse;
    }

    if (isValidOCIPARURL) {
      const fileBlob = await readFileAsArrayBuffer(file);

      const ociAPIResponse = await axios({
        ...sharedAxiosRequestConfig,
        headers: { "Content-Type": file.type },
        method: "PUT",
        data: fileBlob,
      });

      if (ociAPIResponse.status !== 200) {
        throw new Error("OCI Object Storage Upload Failed");
      }

      s3PutAPIResponse = ociAPIResponse;
    }

    return s3PutAPIResponse;
  } catch (error) {
    if (["staging", "production"].includes(appConfig.appENV)) {
      throw new Error("An error occurred in the upload. Please try again later.");
    }

    throw error;
  }
};
