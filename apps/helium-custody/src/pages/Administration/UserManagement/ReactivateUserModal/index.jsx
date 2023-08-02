import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { Form, Formik } from "formik";

const ReactivateUserModal = ({ open, onClose, selectedRow, reactivateEntity }) => {
  const { t } = useTranslation(["onboarding"]);

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

          const requestPayload = {
            isActive: true,
            reason: values?.reason,
          };
          reactivateEntity(requestPayload, selectedRow?.user?.id, selectedRow?.entityId);
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
                {t("onboarding:Forms.Are you sure you want to reactivate user?")}
              </DialogTitle>
              <DialogContent className="overflow-y-visible"></DialogContent>
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
                      {t("onboarding:Forms.Reactivate")}
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

ReactivateUserModal.propTypes = {};

export default ReactivateUserModal;
