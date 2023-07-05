import { FC } from "react";

import { CloseIcon } from "@emrgo-frontend/shared-ui";

import * as Styles from "./CloseButton.styles";
import { ICloseButtonProps } from "./CloseButton.types";

export const CloseButton: FC<ICloseButtonProps> = (props) => {
  return (
    <Styles.CloseButton {...props}>
      <CloseIcon />
    </Styles.CloseButton>
  );
};
