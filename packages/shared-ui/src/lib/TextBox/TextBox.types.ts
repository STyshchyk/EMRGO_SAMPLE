import { HTMLAttributes } from "react";

export interface ITextBoxProps extends HTMLAttributes<HTMLTextAreaElement> {
  maxWidth?: string;
  rows?: number;
}
