import { FC } from "react";

import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalSubtitle,
  ModalTitle,
} from "@emrgo-frontend/shared-ui";
import { useFormik } from "formik";

import { EnterEmailAddressModalSchema } from "./EnterEmailAddressModal.schema";
import {
  IEnterEmailAddressFormProps,
  IEnterEmailAddressModalProps,
} from "./EnterEmailAddressModal.types";

export const EnterEmailAddressModal: FC<IEnterEmailAddressModalProps> = ({
  isOpen,
  onClose,
  onSubmitEmail,
}) => {
  const form = useFormik<IEnterEmailAddressFormProps>({
    initialValues: {
      email: "",
    },
    validateOnMount: true,
    validationSchema: EnterEmailAddressModalSchema,
    onSubmit: (values, { setSubmitting }) => {
      onSubmitEmail(values.email);
      setSubmitting(false);
    },
  });

  return (
    <Modal isOpen={isOpen} width={"30%"}>
      <ModalHeader onClose={onClose}>
        <ModalTitle>Reset your password</ModalTitle>
        <ModalSubtitle>
          To reset your password, enter your account’s verified email address.
        </ModalSubtitle>
      </ModalHeader>
      <ModalContent>
        <Input
          label="Email Address"
          autoFocus
          id="email"
          valid={form.touched.email && !form.errors.email}
          {...form.getFieldProps("email")}
          error={form.touched.email && form.errors.email}
        />
      </ModalContent>
      <ModalFooter>
        <Button
          size="large"
          onClick={() => form.handleSubmit()}
          disabled={!form.isValid || form.isSubmitting}
        >
          Next
        </Button>
      </ModalFooter>
    </Modal>
  );
};
