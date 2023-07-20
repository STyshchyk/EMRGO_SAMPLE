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
import { inviteUserFormSchema } from "../../../../validationSchemas";

const InviteUserModal = ({ open, onClose, inviteUser }) => {
  const { t } = useTranslation(["onboarding"]);
  const { theme } = useTheme();

  return (
    <Fragment>
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={inviteUserFormSchema}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
          }, 2000);

          inviteUser(values);
        }}
      >
        {({ values, handleSubmit }) => (
          <Form>
            <Dialog fullWidth open={open} onClose={onClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="edit-group-types-form-dialog-title">
                {t("onboarding:Forms.Invite User")}
              </DialogTitle>
              <DialogContent>
                <MuiPickersUtilsProvider utils={MomentUtils} locale={theme.locale.altLocale}>
                  <Grid container>
                    <Field
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      component={TextField}
                      label={t("onboarding:Forms.Corporate Email")}
                      name="email"
                      value={values.email}
                      variant="filled"
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              </DialogContent>
              <DialogActions>
                <Grid container justifyContent="flex-end" className="mx-4 mb-4">
                  <Grid item xs={12} lg={4}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleSubmit}
                    >
                      {t("onboarding:Forms.Invite")}
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

InviteUserModal.propTypes = {};

export default InviteUserModal;
