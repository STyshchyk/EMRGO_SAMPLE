import React, { HTMLAttributes } from "react";

import { FormikProps } from "formik";

export interface IMyTextArea<T> extends ITextAreaProps {
  form: FormikProps<T>;
  maxWidth?: number,
  id: Extract<keyof T, string>;
  type?: "text" | "password" | "email" | "file";
  accept: string;
}

export type TMyInputVariants = "signup" | "default";

export interface ITextAreaProps extends HTMLAttributes<HTMLInputElement> {
  /** The input value */
  value?: string;
  /** Change Handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  /** The input variant. Note Signup Variant should only be used on signup flows */
  variant?: TMyInputVariants;
}

// TODO: Implement feedback here: https://github.com/fathomlondon/emrgo-ui/issues/83
