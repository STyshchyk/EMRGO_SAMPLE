import React, { HTMLAttributes } from "react";

export interface IInputFileProps extends HTMLAttributes<HTMLInputElement> {
  /** The input value */
  value?: File | null;
  /** Change Handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** The input label */
  label?: string;
  accept?: string;
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
}
