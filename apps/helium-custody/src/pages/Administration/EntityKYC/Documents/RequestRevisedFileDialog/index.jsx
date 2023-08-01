import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { Form, Formik } from "formik";

const RequestRevisedFileDialog = ({ open, onClose, selectedRow, requestRevisedFile }) => {
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
            supportingDocumentId: selectedRow?.permissions?.supportingDocumentId,
            requestUpdatedVersion: true,
          };
          requestRevisedFile(requestPayload);
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
                {t("documents:Request Dialog.Request Revised Document?")}
              </DialogTitle>
              <DialogContent className="overflow-y-visible"></DialogContent>
              <DialogActions>
                <Grid container justifyContent="flex-end" className="mx-4 mb-4">
                  <Grid item xs={12} lg={4}>
                    <Button type="submit" color="primary" fullWidth onClick={onClose}>
                      {t("documents:Request Dialog.Cancel")}
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
                      {t("documents:Request Dialog.Request")}
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

RequestRevisedFileDialog.propTypes = {};

export default RequestRevisedFileDialog;
