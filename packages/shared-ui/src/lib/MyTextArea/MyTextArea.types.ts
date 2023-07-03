import { FormikProps } from "formik";

export interface IMyTextArea<T> {
  form: FormikProps<T>;
  maxWidth?: number,
  id: Extract<keyof T, string>;
  type?: "text" | "password" | "email" | "file";
  accept: string;
}

export type TMyInputVariants = "signup" | "default";


// TODO: Implement feedback here: https://github.com/fathomlondon/emrgo-ui/issues/83
