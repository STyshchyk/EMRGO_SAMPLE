import { IErrorResponse } from "@emrgo-frontend/types";
import axios, { AxiosError } from "axios";

export const processAPIErrors = (error: Error | AxiosError | unknown) => {
  if (axios.isAxiosError(error)) {
    return processAxiosError(error);
  }
  
  return false;
};

export const processAxiosError = (error: AxiosError<IErrorResponse>) => {
  let errorMessage = "Something went wrong. Please try again";
  if (error) {
    errorMessage = error?.response?.data?.message || "Something went wrong. Please try again";
  }

  return errorMessage;
};
