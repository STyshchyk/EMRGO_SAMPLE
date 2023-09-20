import { AxiosError } from "axios";
import { FormikProps } from "formik";





export interface ILoginProps {}

export interface ILoginContext {
  form: FormikProps<ILoginFormValues>;
  formCode: FormikProps<ILoginCode>;
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
  isError: boolean;
  isTFAModalOpen: boolean;
  error: Error | AxiosError | unknown;
  activeStep: number;
  handleNext: (code: ILoginCode) => void;
  handleBack: () => void;
  openTFASupportTicketModal: () => void;
  closeTFASupportTicketModal: () => void;
}

export interface ILoginFormValues {
  email: string;
  password: string;
}

export interface ILoginCode {
  code: string;
}