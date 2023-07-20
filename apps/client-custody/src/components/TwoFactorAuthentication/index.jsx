import { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Form, Formik } from "formik";
import QRCode from "qrcode.react";

import routes from "../../constants/routes";
import { useTheme } from "../../context/theme-context";
import useWethaqAPIParams from "../../hooks/useWethaqAPIParams";
import * as authActionCreators from "../../redux/actionCreators/auth";
import * as supportActionCreators from "../../redux/actionCreators/support";
import * as authSelectors from "../../redux/selectors/auth";
import * as supportSelectors from "../../redux/selectors/support";
import { delay } from "../../utils/form";
import FileUploadField from "../FileUploadField";
import style from "./style.module.scss";

const ACCEPTABLE_FILE_TYPES = ".pdf";

const initialValues = {
  typeId: "",
  documentId: "",
};

// !DEV ALERT: Unencrypted user login credentials get saved to local storage via Redux on login

const TwoFactorAuthentication = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(["auth"]);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;
  const isAuthenticated = useSelector(authSelectors.selectIsUserAuthenticated);
  const authenticatedUserObject = useSelector(authSelectors.selectAuthenticatedUserObject);
  const { isMFACodeVerified, MFAActive } = authenticatedUserObject;
  const supportTicketTypes = useSelector(supportSelectors.selectSupportTicketTypeDropdowns);
  const filesUploaded = useSelector(supportSelectors.selectFilesUploaded);
  const MFAPath = useSelector(authSelectors.selectMFAPath);
  const [showRaiseTicketModal, setRaiseTicketModal] = useState(false);
  const uploadStatus = useSelector(supportSelectors.selectUploadStatus);
  const isRequesting = useSelector(authSelectors.selectIsRequesting);
  const isUploadingIDDocument = uploadStatus.documentId;

  const TFATicketType = supportTicketTypes?.filter((type) => type.name === "MFA reset")[0];

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(
    () => () => {
      const resetAuthCredsState = () => dispatch(authActionCreators.doResetAuthCredsState());

      resetAuthCredsState();
    },
    [dispatch]
  );

  const { theme } = useTheme();
  const { locale } = theme;

  const submitToken = ({ otp }) => {
    const payload = { otp };
    dispatch(authActionCreators.doSetupMFA(payload));
  };

  useLayoutEffect(() => {
    if (isAuthenticated && isMFACodeVerified) {
      const { from } = location.state || { from: { pathname: routes.dashboard.home } };
      history.push(from);
    }
  }, [history, isAuthenticated, isMFACodeVerified, location]);

  useEffect(() => {
    const fetchMFAPath = (payload) => dispatch(authActionCreators.doFetchMFAPath(payload));
    fetchMFAPath();
  }, [dispatch]);

  const raiseTicket = () => {
    const requestPayload = {
      email: authenticatedUserObject.email,
      type: TFATicketType.name,
      file: filesUploaded?.documentId.key,
    };
    dispatch(supportActionCreators.doCreateTFATicket(requestPayload));
    setRaiseTicketModal(false);
  };

  const handleBackToLoginClick = () => {
    dispatch(authActionCreators.doResetAuthState());
    dispatch(authActionCreators.doLogoutUser());
  };

  const handleFileUpload = (params) => {
    const { files, keyName } = params;
    const payload = {
      requestPayload: {
        originalFileName: files[0]?.name,
        email: authenticatedUserObject.email,
      },
      file: files[0],
      keyName,
    };

    dispatch(supportActionCreators.doUploadTFADocument(payload));
  };

  const buildRequestPayload = (form) => ({
    ...form,
    typeId: form.typeId.value,
    // documentId: filesUploaded?.documentId.key,
  });

  return (
    <Grid container justifyContent="center" alignContent={"center"} className={style.container}>
      {MFAActive ? (
        <Grid
          item
          xs={12}
          md={6}
          container
          direction="column"
          justifyContent="flex-start"
          alignContent="center"
          className={style.container__section}
        >
          <Formik
            initialValues={{ otp: "" }}
            onSubmit={(values) => {
              submitToken(values);
            }}
          >
            {({ values, setFieldValue }) => (
              <Fragment>
                <Form className={style.form} data-testid="login-form">
                  <Box mt={2} mb={4}>
                    <Typography align="center" variant="h5">
                      {t("auth:Enter Security Code")}
                    </Typography>
                    <Typography align="center">
                      {t(
                        "auth:Enter the security code generated by your two-factor authentication app"
                      )}
                      . {t("auth:You will be provided a new security code every 30 seconds")}
                    </Typography>
                  </Box>
                  <Box>
                    <OtpInput
                      value={values.otp}
                      onChange={(value) => setFieldValue("otp", value)}
                      isInputNum
                      numInputs={6}
                      shouldAutoFocus
                      // separator={<Box m={2} />}
                      containerStyle={style.otp__container}
                      inputStyle={style.otp__input}
                      focusStyle={style["otp__input--focus"]}
                      data-testid="otp-input"
                    />
                    <Box mb={2}>
                      <Button
                        type="submit"
                        disabled={values.otp.length !== 6}
                        fullWidth
                        variant="contained"
                        color="primary"
                        id="otpButton"
                        data-testid="otpButton"
                      >
                        {t("auth:Buttons.Proceed")}
                      </Button>
                    </Box>
                    <Grid container justifyContent="space-between">
                      <Button onClick={() => setRaiseTicketModal(true)} color="primary">
                        {t("auth:Buttons.Raise Support Ticket")}
                      </Button>
                      <Button onClick={() => handleBackToLoginClick()} color="primary">
                        {t("auth:Buttons.Back to Login")}
                      </Button>
                    </Grid>
                  </Box>
                </Form>
              </Fragment>
            )}
          </Formik>
        </Grid>
      ) : (
        <Grid
          container
          justifyContent="center"
          alignContent="flex-start"
          className={style.container}
        >
          <Grid
            item
            xs={12}
            md={5}
            container
            direction="column"
            justifyContent="flex-start"
            alignContent="center"
            className={style.container__section}
          >
            {isRequesting ? (
              <CircularProgress />
            ) : (
              <Fragment>
                <Box mt={2} mb={2}>
                  <Typography align="center" variant="h5">
                    {t("auth:Setup Two Factor Authentication ( 2FA )")}
                  </Typography>
                  <Typography align="center">
                    {t(
                      "auth:Scan the following QR Code with a two-factor authentication app on your phone"
                    )}
                  </Typography>
                </Box>
                <Grid container justifyContent="center">
                  {MFAPath ? <QRCode size={200} value={MFAPath} fgColor="#243871" /> : ""}
                </Grid>
                <Grid container justifyContent="center" className="pt-4">
                  <Typography className="text-red-500" variant="caption" align="center">
                    {t(
                      "auth:Download one of the supported applications through your mobile phone's App Store~ Google Authenticator, Microsoft Authenticator, Authy or any other 2FA supported app that you currently use"
                    )}
                  </Typography>
                </Grid>
              </Fragment>
            )}
          </Grid>

          <Grid item xs={12} md={2} container justifyContent="center" alignContent="center">
            <Divider orientation="vertical" className={style.divider} />
          </Grid>

          <Grid
            item
            xs={12}
            md={5}
            container
            direction="column"
            justifyContent="flex-start"
            alignContent="center"
            className={style.container__section}
          >
            <Formik
              initialValues={{ otp: "" }}
              onSubmit={(values) => {
                submitToken(values);
              }}
            >
              {({ values, setFieldValue }) => (
                <Fragment>
                  <Form className={style.form}>
                    <Box mt={2} mb={4}>
                      <Typography align="center" variant="h5">
                        {t("auth:Enter Security Code")}
                      </Typography>
                      <Typography align="center">
                        {t(
                          "auth:Enter the security code generated by your two-factor authentication app"
                        )}
                        .{t("auth:You will be provided a new security code every 30 seconds")}
                      </Typography>
                    </Box>
                    <Box>
                      <OtpInput
                        value={values.otp}
                        onChange={(value) => setFieldValue("otp", value)}
                        isInputNum
                        numInputs={6}
                        shouldAutoFocus
                        // separator={<Box m={2} />}
                        containerStyle={style.otp__container}
                        inputStyle={style.otp__input}
                        focusStyle={style["otp__input--focus"]}
                        data-testid="otp-input"
                      />
                      <Box mb={2}>
                        <Button
                          type="submit"
                          disabled={values.otp.length !== 6}
                          fullWidth
                          variant="contained"
                          color="primary"
                          data-testid="otpButton"
                        >
                          {t("auth:Buttons.Setup")}
                        </Button>
                      </Box>
                      <Grid container justifyContent="space-between">
                        <Button
                          className="text-gray-500"
                          onClick={() => handleBackToLoginClick(true)}
                        >
                          {t("auth:Buttons.Back to Login")}
                        </Button>
                        <Button onClick={() => setRaiseTicketModal(true)} color="primary">
                          {t("auth:Buttons.Raise Support Ticket")}
                        </Button>
                      </Grid>
                    </Box>
                  </Form>
                </Fragment>
              )}
            </Formik>
          </Grid>
        </Grid>
      )}

      <Formik
        initialValues={initialValues}
        // isInitialValid={false}
        onSubmit={async (values, actions) => {
          const bulletinPayload = buildRequestPayload(values);
          raiseTicket(bulletinPayload);
          await delay(1000);
          actions.setSubmitting(false);
          actions.resetForm();
          setRaiseTicketModal(false);
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Dialog
              open={showRaiseTicketModal}
              onClose={() => setRaiseTicketModal(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle id="alert-dialog-title">
                {t("auth:Reset 2FA Modal.Raise 2FA Ticket")}
              </DialogTitle>
              <DialogContent dir={locale.rtl ? "rtl" : "ltr"}>
                <DialogContentText id="alert-dialog-description">
                  {t(
                    "auth:Reset 2FA Modal.Do you want to raise a ticket to Emrgo support to reset your 2 Factor Authentication credentials"
                  )}
                  .
                  {t(
                    "auth:Reset 2FA Modal.Only do this when you have lost access to your authenticator app"
                  )}
                  .
                  {t(
                    "auth:Reset 2FA Modal.Admin will use the file you upload to verify your account"
                  )}
                  .
                </DialogContentText>
                <Box>
                  <FileUploadField
                    label={t("auth:Reset 2FA Modal.Identity Proof")}
                    // isLoading={filesUploadInProgress}
                    name="documentId"
                    fullWidth
                    acceptableFileTypes={ACCEPTABLE_FILE_TYPES}
                    customHandleChange={(e) =>
                      handleFileUpload({ files: e, keyName: "documentId" })
                    }
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setRaiseTicketModal(false);
                  }}
                  color="primary"
                >
                  {t("auth:Reset 2FA Modal.Cancel")}
                </Button>
                <Button
                  disabled={isUploadingIDDocument}
                  onClick={raiseTicket}
                  variant="contained"
                  color="primary"
                >
                  {t("auth:Reset 2FA Modal.Yes, Reset it")}
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        )}
      </Formik>
    </Grid>
  );
};

export default TwoFactorAuthentication;
