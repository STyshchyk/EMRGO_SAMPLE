import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Form, Formik } from "formik";
import PropTypes from "prop-types";

import * as paymentAndSettlementActionCreators from "../../redux/actionCreators/paymentAndSettlement";
import * as securitiesServicesActionCreators from "../../redux/actionCreators/securitiesServices";
import * as securitiesServicesSelectors from "../../redux/selectors/securitiesServices";
import FileUploadField from "../FileUploadField";
import LoadingIndicator from "../LoadingIndicator";

const ACCEPTABLE_FILE_TYPES = ".pdf";

const initialValues = {
  paymentConfirmationFileName: null,
};

const UploadPaymentConfirmationFileForm = ({ isUploading, handleSubmit }) => {
  const { t } = useTranslation(["custody_and_settlement", ""]);

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values }) => {
        const isValid = Array.isArray(values.paymentConfirmationFileName?.files);

        return (
          <Form>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Typography>
                  {t("Upload document evidencing payment ")}(SWIFT, SARIE, UAEFTS, etc.)
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <FileUploadField
                  fullWidth
                  name="paymentConfirmationFileName"
                  acceptableFileTypes={ACCEPTABLE_FILE_TYPES}
                />
              </Grid>
              <Grid item container justifyContent="flex-end">
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    data-testid="submit"
                    disabled={isUploading || !isValid}
                  >
                    <Typography>Upload</Typography>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

UploadPaymentConfirmationFileForm.propTypes = {
  isUploading: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const UploadPaymentConfirmationDialog = ({ open, handleClose, currentlySelectedRowData }) => {
  const { t } = useTranslation(["custody_and_settlement"]);
  const dispatch = useDispatch();

  // selectors
  const isUploading = useSelector(securitiesServicesSelectors.selectIsUploading);

  const handleSubmit = (values, action) => {
    const uploadPaymentConfirmationFile = (payload) =>
      dispatch(securitiesServicesActionCreators.doUploadFile(payload));
    const fetchPaymentsList = () =>
      dispatch(paymentAndSettlementActionCreators.doFetchPaymentsList());

    const fileFieldName = "paymentConfirmationFileName";
    const file = values.paymentConfirmationFileName?.files[0]?.file;
    const isPrimaryIssuance = currentlySelectedRowData?.externalSecurity?.isPrimaryIssuance;

    const requestPayload = {
      fileName: file?.name,
      isPrimaryIssuance,
      name: fileFieldName,
    };

    if (isPrimaryIssuance) {
      requestPayload.sukukId = currentlySelectedRowData.sukukId;
    } else {
      requestPayload.settlementInstructionId = currentlySelectedRowData?.id;
    }

    const payload = {
      requestPayload,
      file,
      keyName: fileFieldName,
      successCallback: () => {
        fetchPaymentsList();
        action.resetForm();
        handleClose();
      },
    };

    uploadPaymentConfirmationFile(payload);
  };

  return (
    <Dialog
      maxWidth="lg"
      open={open}
      onClose={handleClose}
      aria-labelledby="upload-payment-confirmation-file-form-dialog"
    >
      <DialogTitle>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography
              variant="h6"
              style={{
                fontWeight: "bold",
              }}
            >
              {` ${t("Upload Payment Confirmation")} - ${
                currentlySelectedRowData?.externalSecurity?.issuanceName
              }`}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="close"
              onClick={() => {
                handleClose();
              }}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Box pb={2}>
          {isUploading ? (
            <Grid container justifyContent="center">
              <LoadingIndicator />
              <p>Your form submission is being processed</p>
            </Grid>
          ) : (
            <UploadPaymentConfirmationFileForm
              handleClose={() => {
                handleClose();
              }}
              handleSubmit={handleSubmit}
              isUploading={isUploading}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

UploadPaymentConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default UploadPaymentConfirmationDialog;
