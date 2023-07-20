import { useTranslation } from "react-i18next";

// import Grid from '@mui/material/Grid';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Field, Formik } from "formik";
import { TextField } from "formik-mui";
import moment from "moment";
import PropTypes from "prop-types";

import { useTheme } from "../../context/theme-context";
import { delay } from "../../utils/form";
import { updateBulletinFormSchema } from "../../validationSchemas";
import Datepicker from "../Datepicker";
import FileUploadField from "../FileUploadField";

const ACCEPTABLE_FILE_TYPES = ".pdf";

const UpdateBulletinForm = ({
  handleClose,
  onSubmit,
  open,
  handleFileUpload,
  filesUploaded,
  filesUploadInProgress,
  currentBulletin,
}) => {
  const { t } = useTranslation(["bulletin"]);
  const { theme } = useTheme();
  const { locale } = theme;

  const buildRequestPayload = (form) => ({
    ...form,
    itemDate: form.itemDate.format("YYYY-MM-DD"),
    documentId: filesUploaded?.documentId.key,
    bulletinId: currentBulletin.id,
  });

  const initialValues = {
    title: currentBulletin?.title,
    itemDate: moment(currentBulletin?.itemDate),
    documentId: currentBulletin.documentId,
  };

  return (
    <Formik
      initialValues={initialValues}
      // isInitialValid={false}
      enableReinitialize
      validationSchema={updateBulletinFormSchema}
      onSubmit={async (values, actions) => {
        const bulletinPayload = buildRequestPayload(values);
        onSubmit(bulletinPayload);
        await delay(1000);
        actions.setSubmitting(false);
        actions.resetForm();
        handleClose(false);
      }}
    >
      {({ handleSubmit, handleReset }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Dialog
            open={open}
            onClose={() => handleClose(false)}
            aria-labelledby="new-bulletin"
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle id="form-dialog-title">
              {t("bulletin:Update Bulletin Modal.Update Bulletin")}
            </DialogTitle>
            <DialogContent dir={locale.rtl ? "rtl" : "ltr"}>
              <Box mb={2}>
                <DialogContentText>
                  {t("bulletin:Update Bulletin Modal.Bulletin Information")}
                </DialogContentText>
                <Box my={1} className="full-width">
                  <Field
                    component={TextField}
                    label={t("bulletin:Update Bulletin Modal.Bulletin Title")}
                    name="title"
                    variant="filled"
                    fullWidth
                  />
                </Box>
                <Box my={1} className="full-width">
                  <Datepicker
                    label={t("bulletin:Update Bulletin Modal.Bulletin Date")}
                    name="itemDate"
                    materialLabel
                    fullWidth
                  />
                </Box>
                <Box>
                  <FileUploadField
                    // label="Bulletin Document"
                    isLoading={filesUploadInProgress}
                    defaultFiles={
                      currentBulletin.documentId
                        ? [{ file: { name: currentBulletin.documentId } }]
                        : null
                    }
                    name="documentId"
                    fullWidth
                    acceptableFileTypes={ACCEPTABLE_FILE_TYPES}
                    customHandleChange={(e) =>
                      handleFileUpload({
                        files: e,
                        keyName: "documentId",
                        existingDocumentId: currentBulletin.documentId,
                      })
                    }
                  />
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleClose(false);
                  handleReset();
                }}
                color="primary"
              >
                {t("bulletin:Update Bulletin Modal.Cancel")}
              </Button>
              <Button
                disabled={filesUploadInProgress}
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                type="submit"
              >
                {t("bulletin:Update Bulletin Modal.Update")}
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      )}
    </Formik>
  );
};

UpdateBulletinForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  formOptions: PropTypes.shape({
    homepageItemType: PropTypes.array,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  filesUploadInProgress: PropTypes.bool.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  filesUploaded: PropTypes.shape({
    documentId: PropTypes.string,
  }).isRequired,
  currentBulletin: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    itemDate: PropTypes.string,
    type: PropTypes.object,
    documentId: PropTypes.string,
  }).isRequired,
};

export default UpdateBulletinForm;
