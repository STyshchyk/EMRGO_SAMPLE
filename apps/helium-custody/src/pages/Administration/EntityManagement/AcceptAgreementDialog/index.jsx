import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { Form, Formik } from "formik";

import Checkbox from "../../../../components/Checkbox";
import DocumentViewer from "../../../../components/DocumentViewer";
import LoadingIndicator from "../../../../components/LoadingIndicator";
import * as miscellaneousActionCreators from "../../../../redux/actionCreators/miscellaneous";
import * as miscellaneousSelectors from "../../../../redux/selectors/miscellaneous";

const agreementMapping = {
  investorClientTerms: "clientTerms_inv.pdf",
  obligorIssuerClientTerms: "clientTerms_ob.pdf",
  admissionAgreement: "participantAgreement.pdf",
  custodyAgreement: "securitiesAdmission.pdf",
  custodyAgreement_inv: "inv_custody_terms_and_condition.pdf",
};

const AcceptAgreementDialog = ({
  entityId,
  entityGroupId,
  open,
  handleClose,
  handleAcceptAgreement,
  selectedAgreementDoc,
}) => {
  const { t } = useTranslation(["administration", "kyc"]);
  const dispatch = useDispatch();
  const isFetching = useSelector(miscellaneousSelectors.selectIsFetchingDocument);
  const staticFileLink = useSelector(miscellaneousSelectors.selectStaticFileLink);
  const agreementDoc = agreementMapping[selectedAgreementDoc];

  useEffect(() => {
    if (agreementDoc !== "" && agreementDoc !== undefined) {
      dispatch(miscellaneousActionCreators.doFetchStaticFileRequest({ name: agreementDoc }));
    }
  }, [dispatch, agreementDoc]);

  const acceptAgreement = () => {
    const key = `${
      selectedAgreementDoc === "custodyAgreement_inv" ? "custodyAgreement" : selectedAgreementDoc
    }Signed`;
    const data = {};
    data[key] = true;
    const payload = {
      entityGroupId,
      entityId,
      requestPayload: data,
    };
    handleAcceptAgreement(payload);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="edit-group-types-form-dialog-title">
        {t("administration:EntityManagement.EntityManagementTable.Agreement.Accept Agreement")}
      </DialogTitle>
      <DialogContent>
        <Box pb={2}>
          {isFetching ? <LoadingIndicator /> : <DocumentViewer documentURL={staticFileLink} />}
        </Box>
      </DialogContent>
      <DialogActions>
        <Formik
          initialValues={{
            declarationOfAuthorisation: false,
            acceptedTnc: false,
            staticFileLink,
          }}
          onSubmit={(values, { setSubmitting }) => {
            acceptAgreement();
            setSubmitting(false);
          }}
          enableReinitialize
        >
          {({ values, isSubmitting }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid container item xs={12} direction="column">
                  <Checkbox
                    name="declarationOfAuthorisation"
                    label={t(
                      "kyc:Client Terms.I declare I am a person authorised by the Client to request access to the Emrgo Platform and provide the above responses, declaration and documentation and confirm these are true and accurate on the Client's behalf"
                    )}
                  />
                  <Checkbox
                    name="acceptedTnc"
                    label={t("kyc:Client Terms.I agree to the Client Terms")}
                  />
                </Grid>
                <Grid container item xs={12} justifyContent="flex-end">
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      data-testid="submit"
                      disabled={
                        isSubmitting || !(values.declarationOfAuthorisation && values.acceptedTnc)
                      }
                    >
                      {t("administration:EntityManagement.EntityManagementTable.Buttons.Accept")}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid item container xs={12} md={12} lg={12} justify="flex-end">
              <Button type="button" color="primary" data-testid="cancel" onClick={handleClose}>
                {t('administration:EntityManagement.EntityManagementTable.Buttons.Cancel')}
              </Button>
              <Button type="submit" variant="contained" color="primary" data-testid="submit" onClick={acceptAgreement}>
                {t('administration:EntityManagement.EntityManagementTable.Buttons.Accept')}
              </Button>
            </Grid> */}
            </Form>
          )}
        </Formik>
      </DialogActions>
    </Dialog>
  );
};

AcceptAgreementDialog.propTypes = {};

export default AcceptAgreementDialog;
