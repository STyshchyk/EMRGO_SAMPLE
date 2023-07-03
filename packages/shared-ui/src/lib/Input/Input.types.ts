import { HTMLAttributes } from "react";

export type TInputVariants = "signup" | "default";

export interface IInputProps extends HTMLAttributes<HTMLInputElement> {
  /** The input value */
  value?: string;
  /** Change Handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** The input label */
  label?: string;
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
  variant?: TInputVariants;
}
