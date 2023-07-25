import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Iframe from "react-iframe";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { mdiBlockHelper } from "@mdi/js";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Form, Formik } from "formik";
import PropTypes from "prop-types";

import Checkbox from "../../../../components/Checkbox";
import ErrorBanner from "../../../../components/ErrorBanner";
import LoadingIndicator from "../../../../components/LoadingIndicator";
import LoadingPage from "../../../../components/LoadingPage";
import StyledPageTitle from "../../../../components/StyledPageTitle";
import kycOnboardingStatusEnum from "../../../../constants/wethaqAPI/kycOnboardingStatusEnum";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as authActionCreators from "../../../../redux/actionCreators/auth";
import * as clientTermsActionCreators from "../../../../redux/actionCreators/clientTerms";
import * as kycActionCreators from "../../../../redux/actionCreators/kyc";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as clientTermsSelectors from "../../../../redux/selectors/clientTerms";
import * as kycSelectors from "../../../../redux/selectors/kyc";
import style from "./style.module.scss";

const ALLOWED_ENTITY_TYPES = ["OBLIGOR", "INVESTOR", "ISSUER"];

const ClientTermsForm = ({ initialValues, handleSubmit, isSubmitting }) => {
  const { t } = useTranslation(["kyc"]);

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ values }) => {
        const haveAlreadyAgreedToClientTerms =
          initialValues.declarationOfAuthorisation && initialValues.acceptedTnc;

        return (
          <Form>
            <Grid container spacing={2}>
              <Grid container item xs={12} direction="column">
                <Checkbox
                  name="declarationOfAuthorisation"
                  label={t(
                    "Client Terms.I declare I am a person authorised by the Client to request access to the Wethaq Platform and provide the above responses, declaration and documentation and confirm these are true and accurate on the Client's behalf"
                  )}
                  readOnly={haveAlreadyAgreedToClientTerms}
                />
                <Checkbox
                  name="acceptedTnc"
                  label={t("Client Terms.I agree to the Client Terms")}
                  readOnly={haveAlreadyAgreedToClientTerms}
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
                      isSubmitting ||
                      haveAlreadyAgreedToClientTerms ||
                      !(values.declarationOfAuthorisation && values.acceptedTnc)
                    }
                  >
                    {t("Client Terms.Proceed")}
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

ClientTermsForm.propTypes = {
  initialValues: PropTypes.shape({
    declarationOfAuthorisation: PropTypes.bool,
    acceptedTnc: PropTypes.bool,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

const ClientTerms = () => {
  const { t } = useTranslation(["kyc"]);
  const { entityId } = useParams();
  const dispatch = useDispatch();

  const [isIFrameLoading, setIsIFrameLoading] = useState(true);

  const clientTermsPDF = useSelector(clientTermsSelectors.selectClientTermsPDF);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const isFetchingClientTermsPDF = useSelector(clientTermsSelectors.selectFetchingClientTerms);
  const isFetchingKYCData = useSelector(kycSelectors.selectIsFetchingKycData);
  const isSubmittingClientTerms = useSelector(clientTermsSelectors.selectIsSubmittingTerms);
  const kycData = useSelector(kycSelectors.selectKYCData);

  const currentEntityGroupID = currentEntityGroup?.id;
  const currentEntityType = currentEntityGroup.entityType;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    if (!ALLOWED_ENTITY_TYPES.includes(currentEntityType)) return;

    const fetchKYCData = (payload) => dispatch(kycActionCreators.doFetchKYCData(payload));
    const fetchClientTerms = () => dispatch(clientTermsActionCreators.doFetchTerms());

    fetchClientTerms();
    fetchKYCData({
      entityId,
      requestPayload: {
        includeSignedUrl: false,
      },
    });
  }, [dispatch, entityId, currentEntityGroupID, currentEntityType]);

  const handleSubmit = (values, actions) => {
    const doSubmitTerms = (payload) => dispatch(clientTermsActionCreators.doSubmitTerms(payload));

    const requestPayload = {
      ...values,
    };

    doSubmitTerms({
      entityId,
      requestPayload,
      successCallback: () => {
        const fetchKYCData = (payload) => dispatch(kycActionCreators.doFetchKYCData(payload));
        const fetchCurrentUser = () => dispatch(authActionCreators.doFetchCurrentUserData());

        fetchKYCData({
          entityId,
          requestPayload: {
            includeSignedUrl: false,
          },
        });

        fetchCurrentUser();
      },
    });
    actions.resetForm();
  };

  if (isFetchingKYCData || isFetchingClientTermsPDF) {
    return <LoadingPage />;
  }

  if (kycData?.status !== kycOnboardingStatusEnum.APPROVED) {
    return (
      <ErrorBanner title="Pending Compliance Verification" description="" icon={mdiBlockHelper} />
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <StyledPageTitle title={t("Client Terms.Client Terms")} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2">{t("Client Terms.[DESCRIPTION]")}</Typography>
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <Typography
            style={{
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            {t("Client Terms.Client Terms (includes Classification)")}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            minHeight: "70vh",
          }}
        >
          {isIFrameLoading ? <LoadingIndicator /> : null}
          <Iframe
            onLoad={() => {
              setIsIFrameLoading(false);
            }}
            className={style.iframePdf}
            position="relative"
            width="100%"
            height="100%"
            src={clientTermsPDF?.link}
          />
        </Grid>
        <Grid container item xs={12} direction="column">
          <Grid item>
            <ClientTermsForm
              initialValues={{
                declarationOfAuthorisation: kycData?.declarationOfAuthorisation ?? false, // declarationOfAuthorisation is null by default
                acceptedTnc: kycData?.acceptedTnc ?? false, // declarationOfAuthorisation is null by default
              }}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmittingClientTerms}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ClientTerms;
