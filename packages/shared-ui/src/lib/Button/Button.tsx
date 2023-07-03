import { FC } from "react";

import * as Styles from "./Button.styles";
import { IButtonProps } from "./Button.types";

export const Button: FC<IButtonProps> = ({
  children,
  variant,
  size,
  disabled,
  color = "default",
  onClick,
  type,
}: IButtonProps) => {
  return (
    <Styles.Button
      $variant={variant}
      $size={size}
      disabled={disabled}
      onClick={onClick}
      $color={color}
      type={type}
    >
      {children}
    </Styles.Button>
  );
};
