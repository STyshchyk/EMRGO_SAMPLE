import { FC } from "react";

import { CloseIcon } from "@emrgo-frontend/shared-ui";

import * as Styles from "./ModalHeader.styles";
import { IModalHeaderProps } from "./ModalHeader.types";

export const ModalHeader: FC<IModalHeaderProps> = ({ children, onClose }: IModalHeaderProps) => {
  return (
    <Styles.ModalHeader>
      <Styles.Content>{children}</Styles.Content>

      {onClose && (
        <Styles.CloseButton onClick={onClose}>
          <CloseIcon />
        </Styles.CloseButton>
      )}
    </Styles.ModalHeader>
  );
};
