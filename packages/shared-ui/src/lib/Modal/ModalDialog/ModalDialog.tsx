import { FC, useEffect, useState } from "react";

import * as Styles from "./ModalDialog.styles";
import { IModalDialogProps } from "./ModalDialog.types";

export const ModalDialog: FC<IModalDialogProps> = ({
  children,
  width,
  title,
  showCloseButton,
  variant,
  onClose,
}: IModalDialogProps) => {
  /* Adds a small reveal animation */
  const [reveal, setReveal] = useState(false);
  useEffect(() => {
    setReveal(true);
  }, []);

  return (
    <Styles.Wrapper $width={width} $reveal={reveal} variant={variant}>
      <Styles.Header>
        {title && <Styles.Title>{title}</Styles.Title>}
        <Styles.Spacer />
        {showCloseButton && (
          <Styles.CloseButton onClick={onClose}>
            <Styles.CloseIcon />
          </Styles.CloseButton>
        )}
      </Styles.Header>
      <Styles.Content>{children}</Styles.Content>
    </Styles.Wrapper>
  );
};
