import { HTMLAttributes } from "react";

import { FormikProps } from "formik";

export interface IFormikInputProps<T> extends IInputProps {
  form: FormikProps<T>;
  id: Extract<keyof T, string>;
  type?: "text" | "password" | "email" | "file" | "select" | "textarea";
  accept: string;
}

export type TMyInputVariants = "signup" | "default";


// TODO: Implement feedback here: https://github.com/fathomlondon/emrgo-ui/issues/83
