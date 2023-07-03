export type TCodeInputVariants = "signup" | "default";
export type TCodeInputSizes = "medium" | "large";

export interface ICodeInputProps {
  /** onChange event. Receives a string */
  onChange?: (value: string) => void;
  /** The input value. Use hyphens for empty fields */
  value?: string;
  /** The input variant. Note Signup Variant should only be used on signup flows */
  variant?: TCodeInputVariants;
  /* The input is initially focussed */
  focus?: boolean;
  /** Error message */
  error?: string;
  /** Success message */
  success?: string;
  /** The input label. Will be replaces by any other message */
  label?: string;
  /** The size of the input */
  size?: TCodeInputSizes;
}
