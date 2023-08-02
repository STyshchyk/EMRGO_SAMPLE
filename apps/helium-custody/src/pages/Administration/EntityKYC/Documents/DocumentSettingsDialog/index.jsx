import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik } from "formik";
import { CheckboxWithLabel } from "formik-mui";
import PropTypes from "prop-types";

const DocumentSettingsDialog = ({
  open,
  handleClose,
  selectedRow,
  updateDocumentPermissions,
  isRelationshipManager,
  isWethaqService,
}) => {
  const { permissions } = selectedRow || {
    permissions: { client: false, compliance: false, relationshipManager: false },
  };
  const { t } = useTranslation(["documents"]);

  const shouldRelationshipBeDisabled = () => {
    let disabled = false;

    if (isWethaqService) {
      if (isRelationshipManager) {
        disabled = true;
      } else {
        disabled = false;
      }
    } else {
      disabled = true;
    }
    return disabled;
  };

  const shouldClientBeDisabled = () => {
    let disabled = false;

    if (!isWethaqService) {
      disabled = true;
    } else {
      disabled = false;
    }
    return disabled;
  };

  return (
    <Fragment>
      <Formik
        initialValues={{
          compliance: permissions?.compliance,
          relationshipManager: permissions?.relationshipManager,
          client: permissions?.client,
        }}
        onSubmit={(values, { setSubmitting }) => {
          const requestPayload = {
            kycSupportingDocumentId: permissions?.supportingDocumentId,
            ...values,
          };

          updateDocumentPermissions(requestPayload);

          setSubmitting(false);
        }}
        enableReinitialize
      >
        {({ values, handleSubmit }) => (
          <Form noValidate>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
              <DialogTitle id="alert-dialog-title">
                {t("documents:Settings Modal.Document Settings")}
              </DialogTitle>
              <DialogContent>
                <Typography className="font-bold">
                  {t("documents:Settings Modal.View Settings")}
                </Typography>
                <Field
                  component={CheckboxWithLabel}
                  type="checkbox"
                  name="compliance"
                  Label={{ label: t("documents:Settings Modal.Compliance Officer") }}
                  disabled
                />
                <br />
                <Field
                  component={CheckboxWithLabel}
                  type="checkbox"
                  name="relationshipManager"
                  Label={{ label: t("documents:Settings Modal.Relationship Manager") }}
                  disabled={shouldRelationshipBeDisabled()}
                />
                <br />
                <Field
                  component={CheckboxWithLabel}
                  type="checkbox"
                  name="client"
                  Label={{ label: t("documents:Settings Modal.Client") }}
                  disabled={shouldClientBeDisabled()}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    handleClose();
                  }}
                  color="primary"
                >
                  {t("documents:Settings Modal.Cancel")}
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={!isWethaqService}
                  color="primary"
                >
                  {t("documents:Settings Modal.Update Permissions")}
                </Button>
              </DialogActions>
            </Dialog>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};

DocumentSettingsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedRow: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

export default DocumentSettingsDialog;
