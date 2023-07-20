import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";

import { useTheme } from "../../../../context/theme-context";

const DeactivateEntityModal = ({ open, onClose, selectedRow, deactivateEntity }) => {
  const { t } = useTranslation(["onboarding"]);
  const { theme } = useTheme();

  return (
    <Fragment>
      <Formik
        initialValues={{
          reason: "",
        }}
        // validationSchema={}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
          }, 2000);

          const payload = {
            entityId: selectedRow?.id,
            requestPayload: { isActive: false, reason: values?.reason },
          };
          deactivateEntity(payload);
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
                {t("onboarding:Forms.Deactivate Entity")}
              </DialogTitle>
              <DialogContent className="overflow-y-visible">
                <MuiPickersUtilsProvider utils={MomentUtils} locale={theme.locale.altLocale}>
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
                </MuiPickersUtilsProvider>
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
                      {t("onboarding:Forms.Deactivate")}
                    </Button>
                  </Grid>
                </Grid>
              </DialogActions>
            </Dialog>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

DeactivateEntityModal.propTypes = {};

export default DeactivateEntityModal;
