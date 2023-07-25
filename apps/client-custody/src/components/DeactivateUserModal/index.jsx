import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";

import { useTheme } from "../../context/theme-context";

const DeactivateUserModal = ({ open, onClose, selectedRow, deactivateEntity }) => {
  const { t } = useTranslation(["onboarding"]);
  const { theme } = useTheme();

  return (
    <Formik
      initialValues={{
        reason: "",
      }}
      // validationSchema={}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          setSubmitting(false);
        }, 2000);

        const requestPayload = {
          isActive: false,
          reason: values?.reason,
        };
        deactivateEntity(
          requestPayload,
          selectedRow?.user ? selectedRow.user.id : selectedRow.id,
          selectedRow?.entityId
        );
      }}
    >
      {({ handleSubmit }) => (
        <Form>
          <Dialog
            fullWidth
            open={open}
            onClose={onClose}
            aria-labelledby="form-dialog-title"
            PaperProps={{ className: "overflow-y-visible" }}
          >
            <DialogTitle id="edit-group-types-form-dialog-title">
              {t("onboarding:Forms.Deactivate User")}
            </DialogTitle>
            <DialogContent className="overflow-y-visible">
              <Grid container>
                <Field
                  fullWidth
                  component={TextField}
                  minRows={3}
                  multiline
                  label={t("onboarding:Forms.Reason")}
                  name="reason"
                  variant="filled"
                />
              </Grid>
            </DialogContent>
            <DialogActions>
              <Grid container justifyContent="flex-end" className="mx-4 mb-4">
                <Grid item xs={12} lg={4}>
                  <Button type="submit" color="primary" fullWidth onClick={onClose}>
                    {t("onboarding:Forms.Cancel")}
                  </Button>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                  >
                    {t("onboarding:Forms.Submit")}
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </Dialog>
        </Form>
      )}
    </Formik>
  );
};

DeactivateUserModal.propTypes = {};

export default DeactivateUserModal;
