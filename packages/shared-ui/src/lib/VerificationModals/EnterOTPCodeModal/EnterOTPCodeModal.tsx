import { FC } from "react";

import {
  Button,
  CodeInput,
  Hyperlink,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalSubtitle,
  ModalTitle,
  SixDigitCodeInput,
} from "@emrgo-frontend/shared-ui";
import { useFormik } from "formik";

import { EnterOTPCodeFormSchema } from "./EnterOTPCodeModal.schema";
import { IEnterOTPCodeModalFormProps, IEnterOTPCodeModalProps } from "./EnterOTPCodeModal.types";

export const EnterOTPCodeModal: FC<IEnterOTPCodeModalProps> = ({
  isOpen,
  onClose,
  onSetup,
  title = "Enter the code sent to your corporate mobile number",
  subtitle = "We've sent a verification code to your corporate mobile number",
  buttonText = "Setup",
  inputLabel = "Enter verification code",
}) => {
  const form = useFormik<IEnterOTPCodeModalFormProps>({
    initialValues: {
      otp: "",
    },
    validateOnMount: true,
    validationSchema: EnterOTPCodeFormSchema,
    onSubmit: (values, { setSubmitting }) => {
      onSetup(values.otp);
      setSubmitting(false);
    },
  });

  return (
    <Modal isOpen={isOpen} width={516}>
      <ModalHeader onClose={onClose}>
        <ModalTitle>{title}</ModalTitle>
        <ModalSubtitle>{subtitle}</ModalSubtitle>
      </ModalHeader>
      <ModalContent>
        <SixDigitCodeInput
          value={form.values.otp}
          onChange={(otp) => {
            form.setFieldValue("otp", otp);
          }}
          size="large"
        />
      </ModalContent>
      <ModalFooter>
        <Button size="large" type="submit" onClick={() => form.handleSubmit()}>
          {buttonText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};