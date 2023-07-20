import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";

import LoadingIndicator from "../../../../../components/LoadingIndicator";
import * as kycActionCreators from "../../../../../redux/actionCreators/kyc";
import * as kycSelectors from "../../../../../redux/selectors/kyc";
import UploadKYCDocumentForm from "../UploadKYCDocumentForm";

const ModifyDocumentFormDialog = ({ initialValues, documentId, entityId, open, handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["administration"]);
  const isSubmitting = useSelector(kycSelectors.selectIsSubmitting);
  const kycFileData = useSelector(kycSelectors.selectFilesUploaded);

  const handleSubmit = (values) => {
    const postKYCData = (payload) => dispatch(kycActionCreators.doPostKYCData(payload));
    const resetUploadedKYCFileState = () =>
      dispatch(kycActionCreators.doResetUploadedKYCFileState());

    const requestPayload = {
      supportingDocuments: [
        {
          ...values,
          id: documentId,
          name: values.name,
          fileName:
            kycFileData?.supportingDocumentFileName?.fileIdentifier ??
            values.supportingDocumentFileName.fileName,
          supportingDocumentFileName: undefined,
          expiry: values?.expiry ?? undefined,
        },
      ],
    };

    postKYCData({
      entityId,
      requestPayload,
      successCallback: () => {
        const fetchKYCData = (payload) => dispatch(kycActionCreators.doFetchKYCData(payload));

        fetchKYCData({
          entityId,
          requestPayload: {
            keys: ["supportingDocuments"],
            sectionChanges: "documents",
            includeSignedUrl: true,
          },
        });

        handleClose();
      },
    });

    resetUploadedKYCFileState();
  };

  return (
    <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="upload-updated-kyc-document-form-dialog-title">
        <Grid container>
          <Grid item xs={12}>
            <strong>Modify KYC Supporting Document Form</strong>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Box pb={2}>
          {isSubmitting ? (
            <div>
              <LoadingIndicator />
              <p>Your form submission is being processed</p>
            </div>
          ) : (
            <UploadKYCDocumentForm
              entityId={entityId}
              initialValues={initialValues}
              handleSubmit={handleSubmit}
              handleClose={handleClose}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

ModifyDocumentFormDialog.propTypes = {
  initialValues: PropTypes.shape({
    name: PropTypes.string.isRequired,
    supportingDocumentFileName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        name: PropTypes.string,
        fileName: PropTypes.string,
      }),
    ]),
    expiry: PropTypes.string,
  }),
  handleClose: PropTypes.func.isRequired,
  entityId: PropTypes.string.isRequired,
};

export default ModifyDocumentFormDialog;
