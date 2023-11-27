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
import { ensureNotNull } from "@emrgo-frontend/utils";
import { useFormik } from "formik";

import { useUserDetailsContext } from "../UserDetails.provider";
import { EditEmailAddressModalSchema } from "./EditEmailAddressModal.schema";
import * as Styles from "./EditEmailAddressModal.styles";
import {
  IEditEmailAddressModalFormProps,
  IEditEmailAddressModalProps,
} from "./EditEmailAddressModal.types";

export const EditEmailAddressModal = ({ user }: IEditEmailAddressModalProps) => {
  const { setStateOfEditEmailAddressModal, onUpdateEmailAddress, isEditEmailAddressModalOpen } =
    ensureNotNull(useUserDetailsContext());

  const form = useFormik<IEditEmailAddressModalFormProps>({
    initialValues: {
      email: user?.email || "",
    },
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema: EditEmailAddressModalSchema,
    onSubmit: (values, { setSubmitting }) => {
      onUpdateEmailAddress(values);
      setSubmitting(false);
    },
  });

  return (
    <Modal width={480} isOpen={isEditEmailAddressModalOpen}>
      <ModalHeader onClose={() => setStateOfEditEmailAddressModal(false)}>
        <ModalTitle>Edit Corporate Email Address</ModalTitle>
        <ModalSubtitle>
          An email will be sent to your new email address with further steps.
        </ModalSubtitle>
      </ModalHeader>

      <ModalContent>
        <Input
          id="email"
          valid={form.touched.email && !form.errors.email}
          {...form.getFieldProps("email")}
          error={form.touched.email && form.errors.email}
        />
      </ModalContent>

      <ModalFooter>
        <Styles.Spacer />
        <Button
          size="large"
          onClick={() => {
            setStateOfEditEmailAddressModal(false)
            form.resetForm({ values: form.initialValues });
        }}
          variant="secondary"
          disabled={!form.isValid}
        >
          Cancel
        </Button>
        <Button
          size="large"
          onClick={() => form.handleSubmit()}
          type="submit"
          variant="primary"
          disabled={!form.isValid || form.isSubmitting || !form.dirty}
        >
          Update Email
        </Button>
      </ModalFooter>
    </Modal>
  );
};
