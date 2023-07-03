import { FormikProps } from "formik";

export interface ISignupProps {}

export interface ISignupContext {
  form: FormikProps<ISignupFormValues>;
  onVerify: (token: string) => void;
}

export interface ISignupFormValues {
  firstName: string;
  lastName: string;
  entityName: string;
  email: string;
  hasConfirmedClientType: boolean;
  hasAcceptedPrivacyPolicy: boolean;
  captchaToken: string;
}

export interface ISignupEntityExistsValues {
  entityName: string;
}

export interface ISignupEmailExistsValues {
  email: string;
}
