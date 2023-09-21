import { MouseEventHandler, PropsWithChildren } from "react";

// TODO: This should extend the HTML button element
export interface IButtonProps extends PropsWithChildren {
  /** The type of button */
  variant?: TButtonVariants;
  /** The size of the button */
  size?: TButtonSizes;
  /** The button's icon TODO: This should be a component */
  icon?: string;
  /** The button is disabled */
  disabled?: boolean;
  /** The color of the button */
  color?: TButtonColors;
  /** Callback fired when the button is clicked */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** The type of the button */
  type?: TButtonTypes;
}

export type TButtonVariants = "primary" | "secondary" | "text";
export type TButtonSizes = "small" | "medium" | "large";
export type TButtonColors = "default" | "error";
export type TButtonTypes = "submit" | "reset" | "button" | undefined;
