import { Button, Input, Modal } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { useFormik } from "formik";

import { useUserDetailsContext } from "../UserDetails.provider";
import { EditNameModalSchema } from "./EditNameModal.schema";
import * as Styles from "./EditNameModal.styles";
import { IEditNameModalFormProps, IEditNameModalProps } from "./EditNameModal.types";

export const EditNameModal = ({ user }: IEditNameModalProps) => {
  const { setStateOfEditNameModal, onEditName, isEditNameModalOpen } = ensureNotNull(
    useUserDetailsContext()
  );

  const form = useFormik<IEditNameModalFormProps>({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema: EditNameModalSchema,
    onSubmit: (values, { setSubmitting }) => {
      onEditName(values);
      setSubmitting(false);
    },
  });

  return (
    <Modal width={480} isOpen={isEditNameModalOpen} variant="darkened">
      <Styles.Wrapper>
        <Styles.Title>Edit Name</Styles.Title>
        <Styles.Content>
          <Input
            label="First Name"
            id="firstName"
            valid={form.touched.firstName && !form.errors.firstName}
            {...form.getFieldProps("firstName")}
            error={form.touched.firstName && form.errors.firstName}
          />
          <Input
            label="Last Name"
            id="lastName"
            valid={form.touched.lastName && !form.errors.lastName}
            {...form.getFieldProps("lastName")}
            error={form.touched.lastName && form.errors.lastName}
          />
        </Styles.Content>

        <Styles.Footer>
          <Styles.Spacer />
          <Button
            size="large"
            onClick={() => {
                setStateOfEditNameModal(false)
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
            variant="primary"
            type="submit"
            disabled={!form.isValid || form.isSubmitting || !form.dirty}
          >
            Update Name
          </Button>
        </Styles.Footer>
      </Styles.Wrapper>
    </Modal>
  );
};
