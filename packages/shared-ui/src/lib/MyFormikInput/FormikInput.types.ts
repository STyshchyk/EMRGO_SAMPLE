import React, { HTMLAttributes } from "react";

import { FormikProps } from "formik";

export interface IFormikInputProps<T> extends IInputProps {
  form: FormikProps<T>;
  id: Extract<keyof T, string>;
  type?: "text" | "password" | "email" | "file" | "select" | "textarea";
  accept: string;
}

export type TMyInputVariants = "signup" | "default";

export interface IInputProps extends HTMLAttributes<any> {
  /** The input value */
  value?: string;
  /** Change Handler */
  onChange?: (e: React.ChangeEvent<any>) => void;
  /** The input label */
  label: string;
  /** The input is in an error state */
  error?: string | false;
  /** The input helper text */
  helperText?: string;
  /** Disable the input */
  disabled?: boolean;
  /** The input is in a valid state */
  valid?: boolean;
  /** The input id, used to set htmlFor and id. Will fallback to a uuid */
  id?: string;
  /** maximum width in pixels */
  maxWidth?: number;
  maxHeight?: number;
  rows?: number;
  cols?: number;
  /** The input variant. Note Signup Variant should only be used on signup flows */
  variant?: TMyInputVariants;
}

// TODO: Implement feedback here: https://github.com/fathomlondon/emrgo-ui/issues/83
