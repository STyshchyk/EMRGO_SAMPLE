import { FormikProps } from "formik";

export interface IResetPasswordSixDigitCodeProps {
  method: "authenticator" | "phone";
}

export interface IResetPasswordSixDigitCodeContext {
  form: FormikProps<IResetPasswordSixDigitCodeValues>;
}

export interface IResetPasswordSixDigitCodeValues {
  email: string;
  code: string;
  verificationType: string;
}
