import { FC } from "react";

import { CheckNotificationIcon, CloseIcon, ErrorIcon, InfoFillIcon, WarningIcon } from "../Icons";
import * as Styles from "./Toast.styles";
import { IToastProps } from "./Toast.types";

export const Toast: FC<IToastProps> = ({ children, variant, onClose }: IToastProps) => {
  return (
    <Styles.Container role="alert" $variant={variant}>
      <Styles.Icon>
        {variant === "success" && <CheckNotificationIcon />}
        {variant === "info" && <InfoFillIcon />}
        {variant === "error" && <ErrorIcon />}
        {variant === "warning" && <WarningIcon />}
      </Styles.Icon>

      <Styles.Text>{children}</Styles.Text>

      <Styles.CloseButton onClick={onClose}>
        <CloseIcon />
      </Styles.CloseButton>
    </Styles.Container>
  );
};
