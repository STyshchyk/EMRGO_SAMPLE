import { FormikProps } from "formik";

export interface ICreatePasswordProps {}

export interface ICreatePasswordContext {
  form: FormikProps<ICreatePasswordFormValues>;
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
}

export interface ICreatePasswordFormValues {
  password: string;
  confirmPassword?: string;
  token: string;
}
