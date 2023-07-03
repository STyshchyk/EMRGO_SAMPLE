import { FC } from "react";

import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@emrgo-frontend/shared-ui";

import { IAddCorporateMobileModalProps } from "./AddCorporateMobileModal.types";

export const AddCorporateMobileModal: FC<IAddCorporateMobileModalProps> = ({
  isOpen,
  onClose,
  onAddNumber,
}) => {
  return (
    <Modal isOpen={isOpen} width={516}>
      <ModalHeader onClose={onClose}>
        <ModalTitle>Add corporate mobile number</ModalTitle>
      </ModalHeader>
      <ModalContent>
        <Input label="Corporate mobile number" autoFocus />
      </ModalContent>
      <ModalFooter>
        <Button size="large" onClick={onAddNumber}>
          Add number
        </Button>
      </ModalFooter>
    </Modal>
  );
};
