import { FormikProps } from "formik";

export interface IResetPasswordOptionsProps {}

export interface IResetPasswordOptionsContext {
  form: FormikProps<IResetPasswordOptionsPhoneValues>;
}

export interface IResetPasswordOptionsPhoneValues {
  email: string;
  options?: string | null;
}

export interface IResetPasswordOptionsPhoneRequest {
  email: string;
}
