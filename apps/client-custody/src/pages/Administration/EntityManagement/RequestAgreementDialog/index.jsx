import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik } from "formik";
import { CheckboxWithLabel } from "formik-mui";

import LoadingIndicator from "../../../../components/LoadingIndicator";
import * as kycSelectors from "../../../../redux/selectors/kyc";

const RequestAgreementDialog = ({
  entityId,
  entityGroupId,
  entityType,
  open,
  handleClose,
  handleRequestAgreement,
  agreements,
}) => {
  const { t } = useTranslation(["administration"]);
  const isSubmitting = useSelector(kycSelectors.selectIsRequesting);

  const isInvestor = ["INVESTOR"].includes(entityType);
  const isObligor = ["OBLIGOR"].includes(entityType);
  const isIssuer = ["ISSUER"].includes(entityType);

  const investorClientTermsSigned = agreements?.investorClientTermsSigned;
  const obligorIssuerClientTermsSigned = agreements?.obligorIssuerClientTermsSigned;
  const custodyAgreementSigned = agreements?.custodyAgreementSigned;
  const admissionAgreementSigned = agreements?.admissionAgreementSigned;

  return (
    <Formik
      initialValues={{
        investorClientTermsRequested: agreements?.investorClientTermsRequested || false,
        obligorIssuerClientTermsRequested: agreements?.obligorIssuerClientTermsRequested || false,
        custodyAgreementRequested: agreements?.custodyAgreementRequested || false,
        admissionAgreementRequested: agreements?.admissionAgreementRequested || false,
      }}
      enableReinitialize
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          setSubmitting(false);
        }, 3000);

        handleRequestAgreement({ entityGroupId, entityId, requestPayload: values }, setSubmitting);
      }}
    >
      {({ handleSubmit }) => (
        <Form>
          <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="edit-group-types-form-dialog-title">
              {t(
                "administration:EntityManagement.EntityManagementTable.Agreement.Request Agreement"
              )}
            </DialogTitle>
            <DialogContent>
              <Box pb={2}>
                {isSubmitting ? (
                  <div>
                    <LoadingIndicator />
                  </div>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item container direction="column" xs={12} md={12} lg={12}>
                      <Typography className="font-bold">
                        {t(
                          "administration:EntityManagement.EntityManagementTable.Agreement.Issuance Module"
                        )}
                      </Typography>
                      <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        name="investorClientTermsRequested"
                        disabled={
                          isSubmitting || isObligor || isIssuer || investorClientTermsSigned
                        }
                        Label={{
                          label: t(
                            "administration:EntityManagement.EntityManagementTable.Agreement.Investor Client Terms"
                          ),
                        }}
                      />
                      <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        name="obligorIssuerClientTermsRequested"
                        disabled={isSubmitting || isInvestor || obligorIssuerClientTermsSigned}
                        Label={{
                          label: t(
                            "administration:EntityManagement.EntityManagementTable.Agreement.Client Terms",
                            { context: entityType === "INVESTOR" ? "OBLIGOR" : entityType }
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item container direction="column" xs={12} md={12} lg={12}>
                      <Typography className="font-bold">
                        {t(
                          "administration:EntityManagement.EntityManagementTable.Agreement.Securities Services"
                        )}
                      </Typography>
                      <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        name="custodyAgreementRequested"
                        disabled={isSubmitting || isIssuer || isObligor || custodyAgreementSigned}
                        Label={{
                          label: t(
                            "administration:EntityManagement.EntityManagementTable.Agreement.Custody Agreement"
                          ),
                        }}
                      />
                      <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        name="admissionAgreementRequested"
                        disabled={
                          isSubmitting || isInvestor || isObligor || admissionAgreementSigned
                        }
                        Label={{
                          label: t(
                            "administration:EntityManagement.EntityManagementTable.Agreement.Admission Agreement"
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Grid item container xs={12} md={12} lg={12} justifyContent="flex-end">
                <Button type="button" color="primary" data-testid="cancel" onClick={handleClose}>
                  {t("administration:EntityManagement.EntityManagementTable.Agreement.Cancel")}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  data-testid="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {t(
                    "administration:EntityManagement.EntityManagementTable.Agreement.Send Request"
                  )}
                </Button>
              </Grid>
            </DialogActions>
          </Dialog>
        </Form>
      )}
    </Formik>
  );
};

RequestAgreementDialog.propTypes = {};

export default RequestAgreementDialog;
