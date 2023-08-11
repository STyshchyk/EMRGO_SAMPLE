import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";

import { useTheme } from "../../../../context/theme-context";

const ArchiveUserModal = ({ open, onClose, selectedRow, archiveUser }) => {
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

          const requestPayload = {
            isArchived: true,
          };
          archiveUser(requestPayload, selectedRow?.user?.id, selectedRow?.entityId);
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
                {t("onboarding:Forms.Archive User")}
              </DialogTitle>
              <DialogContent className="overflow-y-visible">
                <DialogContentText id="alert-dialog-description">
                  {t(
                    "onboarding:Forms.This action is not reversible Users once archived will disable the account permanently Are you sure you want to continue?"
                  )}
                </DialogContentText>
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
                      {t("onboarding:Forms.Archive")}
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

ArchiveUserModal.propTypes = {};

export default ArchiveUserModal;
