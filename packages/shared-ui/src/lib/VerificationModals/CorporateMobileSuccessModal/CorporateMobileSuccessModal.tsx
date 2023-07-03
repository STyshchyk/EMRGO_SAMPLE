import { FC } from "react";

import { Button, Modal, ModalFooter, ModalHeader, ModalTitle } from "@emrgo-frontend/shared-ui";

import { ICorporateMobileSuccessModalProps } from "./CorporateMobileSuccessModal.types";

export const CorporateMobileSuccessModal: FC<ICorporateMobileSuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} width={16}>
      <ModalHeader>
        <ModalTitle>Your account has been secured using your corporate mobile number</ModalTitle>
      </ModalHeader>
      <ModalFooter>
        <Button size="large" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
