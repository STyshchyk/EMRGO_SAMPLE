import { FormikProps } from "formik";

export interface IResetPasswordProps {}

export interface IResetPasswordContext {
  form: FormikProps<IResetPasswordFormValues>;
}

export interface IResetPasswordFormValues {
  email: string;
}
