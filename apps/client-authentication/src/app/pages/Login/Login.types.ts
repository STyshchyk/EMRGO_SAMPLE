import { AxiosError } from "axios";
import { FormikProps } from "formik";

export interface ILoginProps {}

export interface ILoginContext {
  form: FormikProps<ILoginFormValues>;
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
  isError: boolean;
  error: Error | AxiosError | unknown;
  activeStep:number;
  handleNext:() => void;
  handleBack:() => void;
}

export interface ILoginFormValues {
  email: string;
  password: string;
  code?: string;
}
