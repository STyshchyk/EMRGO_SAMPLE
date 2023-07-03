import { FormikProps } from "formik";

import { IInputProps } from "../Input";

export interface IFormikInputProps<T> extends IInputProps {
  form: FormikProps<T>;
  disabled?: boolean;
  id: Extract<keyof T, string>;
  type?: "text" | "password" | "email";
}

// TODO: Implement feedback here: https://github.com/fathomlondon/emrgo-ui/issues/83
