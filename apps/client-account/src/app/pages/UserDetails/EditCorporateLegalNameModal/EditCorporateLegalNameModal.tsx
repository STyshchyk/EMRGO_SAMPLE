import { Button, Input, Modal } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { useFormik } from "formik";

import { useUserDetailsContext } from "../UserDetails.provider";
import { EditCorporateLegalNameModalSchema } from "./EditCorporateLegalNameModal.schema";
import * as Styles from "./EditCorporateLegalNameModal.styles";
import {
  IEditCorporateLegalNameModalFormProps,
  IEditCorporateLegalNameModalProps,
} from "./EditCorporateLegalNameModal.types";

export const EditCorporateLegalNameModal = ({ user }: IEditCorporateLegalNameModalProps) => {
  const {
    setStateOfEditCorporateLegalNameModal,
    onUpdateCorporateLegalName,
    isEditCorporateLegalNameModalOpen,
  } = ensureNotNull(useUserDetailsContext());

  const form = useFormik<IEditCorporateLegalNameModalFormProps>({
    initialValues: {
      name: user?.entityName || "",
    },
    enableReinitialize: true,
    validationSchema: EditCorporateLegalNameModalSchema,
    onSubmit: (values, { setSubmitting }) => {
      onUpdateCorporateLegalName(values);
      setSubmitting(false);
    },
  });

  return (
    <Modal width={480} isOpen={isEditCorporateLegalNameModalOpen} variant="darkened">
      <Styles.Wrapper>
        <Styles.Title>Edit Corporate Legal Name</Styles.Title>
        <Styles.Content>
          <Input
            id="name"
            valid={form.touched.name && !form.errors.name}
            {...form.getFieldProps("name")}
            error={form.touched.name && form.errors.name}
          />
        </Styles.Content>

        <Styles.Footer>
          <Styles.Spacer />
          <Button
            size="large"
            onClick={() => {
                setStateOfEditCorporateLegalNameModal(false)
                form.resetForm({ values: form.initialValues });
            }}
            variant="secondary"
            disabled={!form.isValid}
          >
            Cancel
          </Button>
          <Button
            size="large"
            type="submit"
            onClick={() => form.handleSubmit()}
            variant="primary"
            disabled={!form.isValid || form.isSubmitting || !form.dirty}
          >
            Update Name
          </Button>
        </Styles.Footer>
      </Styles.Wrapper>
    </Modal>
  );
};
