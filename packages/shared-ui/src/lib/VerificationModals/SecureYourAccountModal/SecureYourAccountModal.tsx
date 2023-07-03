import { FC, useState } from "react";

import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalSubtitle,
  ModalTitle,
  RadioButton,
} from "@emrgo-frontend/shared-ui";
import { TSecureAccountFlowOption } from "@emrgo-frontend/types";

import * as Styles from "./SecureYourAccountModal.styles";
import { ISecureYourAccountModalProps } from "./SecureYourAccountModal.types";

export const SecureYourAccountModal: FC<ISecureYourAccountModalProps> = ({
  isOpen,
  onClose,
  onSecureByApp,
  onSecureByText,
}) => {
  const [option, setOption] = useState<TSecureAccountFlowOption | undefined>();

  const onNext = () => {
    if (option === "text") {
      onSecureByText();
    }

    if (option === "app") {
      onSecureByApp();
    }
  };

  return (
    <Modal isOpen={isOpen} width={506}>
      <ModalHeader onClose={onClose}>
        <ModalTitle>Secure your account</ModalTitle>
        <ModalSubtitle>
          Secure your account with two-factor authentication using your phone number or
          authenticator app.
        </ModalSubtitle>
      </ModalHeader>
      <ModalContent>
        <Styles.Options>
          <RadioButton
            name="options"
            checked={option === "text"}
            onChange={() => setOption("text")}
          >
            Text message via your phone
          </RadioButton>
          <RadioButton name="options" checked={option === "app"} onChange={() => setOption("app")}>
            From your authenticator app
          </RadioButton>
        </Styles.Options>
      </ModalContent>
      <ModalFooter>
        <Button size="large" onClick={onNext}>
          Next
        </Button>
      </ModalFooter>
    </Modal>
  );
};
