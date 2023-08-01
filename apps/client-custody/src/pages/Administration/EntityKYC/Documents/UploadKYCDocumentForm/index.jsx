import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import moment from "moment";
import PropTypes from "prop-types";

import FileUploadField from "../../../../../components/FileUploadField";
import { useTheme } from "../../../../../context/theme-context";
import useWethaqAPIParams from "../../../../../hooks/useWethaqAPIParams";
import * as kycActionCreators from "../../../../../redux/actionCreators/kyc";
import * as authSelectors from "../../../../../redux/selectors/auth";
import * as kycSelectors from "../../../../../redux/selectors/kyc";

const ACCEPTABLE_FILE_TYPES = [
  ".png",
  ".jpg",
  ".pdf",
  ".doc",
  ".docx",
  "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  ".xlsx",
  ".xls",
];

const UploadKYCDocumentForm = ({ initialValues, handleSubmit, handleClose, entityId }) => {
  const { t } = useTranslation(["documents"]);
  const dispatch = useDispatch();
  const { theme } = useTheme();

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const isUploading = useSelector(kycSelectors.selectIsUploading);
  const currentEntityGroupID = currentEntityGroup?.id;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const handleSingleFileUpload = ({ files, keyName }) => {
    const doUploadFile = (payload) => {
      dispatch(kycActionCreators.doUploadKycFile(payload));
    };

    const payload = {
      requestPayload: {
        originalFileName: files[0]?.name,
        name: keyName,
      },
      file: files[0],
      keyName,
      multiple: false,
      entityId,
    };

    doUploadFile(payload);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ values }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item container xs={12}>
              <Grid item xs={4} container direction="column" justifyContent="center">
                <Typography>{t("documents:Upload Modal.Name")}</Typography>
              </Grid>
              <Grid item xs={8}>
                <Field
                  required
                  fullWidth
                  component={TextField}
                  name="name"
                  variant="filled"
                  type="text"
                  // inputProps={{
                  //   maxLength: 40,
                  // }}
                />
              </Grid>
            </Grid>

            <Grid item container xs={12}>
              <Grid item xs={4} container direction="column" justifyContent="center">
                <Typography>{t("documents:Upload Modal.Upload Document")}</Typography>
              </Grid>
              <Grid item xs={8}>
                <FileUploadField
                  fullWidth
                  name="supportingDocumentFileName"
                  acceptableFileTypes={ACCEPTABLE_FILE_TYPES.join(",")}
                  customHandleChange={(e) =>
                    handleSingleFileUpload({ files: e, keyName: "supportingDocumentFileName" })
                  }
                  defaultFiles={
                    values.supportingDocumentFileName
                      ? [{ file: { name: values.supportingDocumentFileName.files[0].file } }]
                      : null
                  }
                />
              </Grid>
            </Grid>

            <Grid item container lg={12}>
              <Grid item xs={4} container direction="column" justifyContent="center">
                <Typography>
                  {t("documents:Upload Modal.Document Expiry (if applicable)")}
                </Typography>
              </Grid>
              <Grid xs={8} container alignContent="center" className="px-1">
                <Field
                  fullWidth
                  format="DD/MM/YYYY"
                  inputVariant="filled"
                  inputProps={{
                    shrink: "false",
                  }}
                  minDate={moment()}
                  variant="dialog"
                  placeholder="DD/MM/YYYY"
                  component={DatePicker}
                  name="expiry"
                />
              </Grid>
            </Grid>

            <Grid item container xs={12} md={12} lg={12} justifyContent="flex-end">
              <Button type="button" color="primary" data-testid="cancel" onClick={handleClose}>
                {t("documents:Upload Modal.Cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                data-testid="submit"
                disabled={isUploading}
              >
                {t("documents:Upload Modal.Submit")}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

UploadKYCDocumentForm.propTypes = {
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

export default UploadKYCDocumentForm;
