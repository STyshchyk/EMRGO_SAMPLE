import { FC } from "react";
import { createPortal } from "react-dom";

import { IModalProps } from "./Modal.types";
import { ModalDialog } from "./ModalDialog";
import { ModalShade } from "./ModalShade";

export const Modal: FC<IModalProps> = ({
  children,
  isOpen,
  onClose,
  width,
  title,
  shaded,
  showCloseButton,
  variant,
}) =>
  isOpen
    ? createPortal(
        <ModalShade onClick={onClose} shaded={shaded}>
          <ModalDialog
            width={width}
            title={title}
            onClose={onClose}
            showCloseButton={showCloseButton}
            variant={variant}
          >
            {children}
          </ModalDialog>
        </ModalShade>,
        document.body
      )
    : null;
