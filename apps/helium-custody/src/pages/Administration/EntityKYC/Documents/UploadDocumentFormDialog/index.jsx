import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

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

const initialValues = {
  expiry: "",
  name: "",
  supportingDocumentFileName: null,
};

const UploadKYCDocumentFormDialog = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { entityId } = useParams();
  const { t } = useTranslation(["documents"]);

  const kycFileData = useSelector(kycSelectors.selectFilesUploaded);
  const isSubmitting = useSelector(kycSelectors.selectIsSubmitting);

  const handleSubmit = (values) => {
    const postKYCData = (payload) => dispatch(kycActionCreators.doPostKYCData(payload));

    const requestPayload = {
      supportingDocuments: [
        {
          ...values,
          name: values.name,
          fileName: kycFileData?.supportingDocumentFileName?.fileIdentifier,
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
        const resetUploadedKYCFileState = () =>
          dispatch(kycActionCreators.doResetUploadedKYCFileState());

        fetchKYCData({
          entityId,
          requestPayload: {
            keys: ["supportingDocuments"],
            sectionChanges: "documents",
            includeSignedUrl: true,
          },
        });

        resetUploadedKYCFileState();
        handleClose();
      },
    });
  };

  return (
    <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="upload-kyc-document-form-dialog-title">
        <Grid container>
          <Grid item xs={12}>
            <strong>{t("documents:Upload Modal.Upload KYC Supporting Document Form")}</strong>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Box pb={2}>
          {isSubmitting ? (
            <div>
              <LoadingIndicator />
              <p>{t("documents:Upload Modal.Your form submission is being processed")}</p>
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

UploadKYCDocumentFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default UploadKYCDocumentFormDialog;
