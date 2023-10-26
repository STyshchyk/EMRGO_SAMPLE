import React, { FC } from "react";

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
  ...rest
}: IButtonProps) => {
  console.log(rest);
  return (
    <Styles.Button
      $variant={variant}
      $size={size}
      disabled={disabled}
      onClick={onClick}
      $color={color}
      type={type}
      {...rest}
    >
      {children}
    </Styles.Button>
  );
};
