/* eslint-disable import/prefer-default-export */
import { toast } from "react-toastify";

export const extractErrorMessage = (error) => {
  let errorMessage = null;

  if (error.response) {
    errorMessage = error.response?.data?.message;
  } else {
    errorMessage = error?.message;
  }

  return errorMessage;
};

export const extractErrorStatusCode = (error) => {
  let errorStatusCode = null;

  errorStatusCode = error.response?.status;

  return errorStatusCode;
};

export const loadTest = (data, count) => {
  let loadedData = [];
  for (let i = 0; i < count; i += 1) {
    loadedData = loadedData.concat(data);
  }
  return loadedData;
};

export const showToastErrorNotification = (error, errorMessage) => {
  const errorStatusCode = extractErrorStatusCode(error);

  if (errorStatusCode === 401 || errorStatusCode === 403) {
    return;
  }

  toast.error(errorMessage);
};
