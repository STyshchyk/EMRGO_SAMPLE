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
import { EditPhoneNumberModalSchema } from "./EditPhoneNumberModal.schema";
import * as Styles from "./EditPhoneNumberModal.styles";
import {
  IEditPhoneNumberModalFormProps,
  IEditPhoneNumberModalProps,
} from "./EditPhoneNumberModal.types";

export const EditPhoneNumberModal = ({ user }: IEditPhoneNumberModalProps) => {
  const {
    isMobileModalTypeAdd,
    setStateOfEditCorporateMobileNumberModal,
    onAddCorporateMobileNumber,
    onUpdateCorporateMobileNumber,
    isEditCorporateMobileNumberModalOpen,
  } = ensureNotNull(useUserDetailsContext());

  const form = useFormik<IEditPhoneNumberModalFormProps>({
    initialValues: {
      phone: user?.phone || "",
    },
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema: EditPhoneNumberModalSchema,
    onSubmit: (values, { setSubmitting }) => {
      if (isMobileModalTypeAdd) {
        onAddCorporateMobileNumber(values);
      } else {
        onUpdateCorporateMobileNumber(values);
      }
      setSubmitting(false);
    },
  });

  return (
    <Modal width={"30%"} isOpen={isEditCorporateMobileNumberModalOpen}>
      <form onSubmit={form.handleSubmit}>
        <ModalHeader
          onClose={() => setStateOfEditCorporateMobileNumberModal(false, isMobileModalTypeAdd)}
        >
          <ModalTitle>{`${
            isMobileModalTypeAdd ? "Add" : "Edit"
          } corporate mobile number`}</ModalTitle>
          <ModalSubtitle>
            Please add your number with the country code. An OTP will be sent to your new phone
            number.
          </ModalSubtitle>
        </ModalHeader>
        <ModalContent>
          <Input
            id="phone"
            valid={form.touched.phone && !form.errors.phone}
            {...form.getFieldProps("phone")}
            error={form.touched.phone && form.errors.phone}
          />
        </ModalContent>

        <ModalFooter>
          <Styles.Spacer />
          <Button
            size="large"
            onClick={() => {
                setStateOfEditCorporateMobileNumberModal(false, false)
                form.resetForm({ values: form.initialValues });
            }}
            variant="secondary"
            disabled={!form.isValid}
            type="button"
          >
            Cancel
          </Button>
          <Button
            size="large"
            // onClick={() => form.handleSubmit()}
            variant="primary"
            type="submit"
            disabled={!form.isValid || form.isSubmitting}
          >
            {isMobileModalTypeAdd ? "Add" : "Edit"} Mobile Number
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
