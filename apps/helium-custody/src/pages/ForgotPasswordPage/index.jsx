import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import { mdiEmailFastOutline } from "@mdi/js";
import Icon from "@mdi/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";

import AnimatedInputField from "../../components/AnimatedInputField";
import FileUploadField from "../../components/FileUploadField";
// import InputField from '../../components/InputField';
// import Button from '../../components/Button';
import routes from "../../constants/routes";
import { useTheme } from "../../context/theme-context";
import * as authActionCreators from "../../redux/actionCreators/auth";
import * as supportActionCreators from "../../redux/actionCreators/support";
import * as authSelectors from "../../redux/selectors/auth";
import * as supportSelectors from "../../redux/selectors/support";
import { forgotPasswordSchema } from "../../validationSchemas";
import style from "./style.module.scss";

const ACCEPTABLE_FILE_TYPES = ".pdf";

const initialValues = {
  email: "",
  typeId: "",
  documentId: "",
};

const ForgotPasswordEmailSuccess = () => {
  const { t } = useTranslation(["auth"]);
  return (
    <div className={style.success}>
      <div className={style.success__icon__wrapper}>
        <Icon
          className={style.success__icon}
          path={mdiEmailFastOutline}
          size={8}
          title={t("auth:Action Complete")}
        />
      </div>
      <span className={style.success__descriptor}>
        {t(
          "auth:If your email exists in our database, an email will have been sent containing further instructions"
        )}
      </span>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Link to={routes.public.login} component={RouterLink}>
          {t("auth:Buttons.Return to login page")}
        </Link>
      </div>
    </div>
  );
};

const PasswordResetRequestForm = () => {
  const { t } = useTranslation(["auth"]);
  const { theme } = useTheme();
  const { locale } = theme;
  const dispatch = useDispatch();
  const isRequesting = useSelector(authSelectors.selectIsRequesting);
  const supportTicketTypes = useSelector(supportSelectors.selectSupportTicketTypeDropdowns);
  const filesUploaded = useSelector(supportSelectors.selectFilesUploaded);
  const [showRaiseTicketModal, setRaiseTicketModal] = useState(false);

  const TFATicketType = supportTicketTypes?.filter((type) => type.name === "Password reset")[0];

  const requestPasswordReset = (values) => {
    const requestPayload = {
      ...values,
    };

    const requestPasswordResetLink = (payload) =>
      dispatch(authActionCreators.doRequestPasswordReset(payload));
    requestPasswordResetLink(requestPayload);
  };

  const raiseTicket = (values) => {
    const requestPayload = {
      email: values.email,
      type: TFATicketType.name,
      file: filesUploaded?.documentId.key,
    };
    dispatch(supportActionCreators.doCreateTFATicket(requestPayload));
    setRaiseTicketModal(false);
  };

  const handleFileUpload = (params) => {
    const { files, keyName, values } = params;
    const payload = {
      requestPayload: {
        originalFileName: files[0]?.name,
        email: values.email,
      },
      file: files[0],
      keyName,
    };

    dispatch(supportActionCreators.doUploadTFADocument(payload));
  };

  return (
    <Fragment>
      <Formik
        initialValues={{
          email: "",
          otp: "",
        }}
        validationSchema={forgotPasswordSchema}
        onSubmit={(values) => requestPasswordReset(values)}
      >
        {({ values, setFieldValue }) => (
          <Form className={style.form} data-testid="forgot-password-form">
            <span className={style.form__descriptor}>
              {t(
                "auth:Enter your user account's verified email address and OTP from your authenticator app and we will send you a password reset link"
              )}
            </span>
            <AnimatedInputField name="email" type="email" label={t("auth:Email")} />
            <br />
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
            />
            <br />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isRequesting}
              size="large"
              data-testid="submit"
            >
              <span className="btn-text">{t("auth:Send Password Reset Email")}</span>
            </Button>
            <br />
            <Grid container width="100" justifyContent="space-between">
              <Button onClick={() => setRaiseTicketModal(true)} color="primary">
                {t("auth:Buttons.Raise Support Ticket")}
              </Button>
              <Button to={routes.public.login} component={RouterLink} color="primary">
                {t("auth:Buttons.Return to login page")}
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
      <Formik initialValues={initialValues}>
        {({ handleSubmit, values }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Dialog
              open={showRaiseTicketModal}
              onClose={() => setRaiseTicketModal(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle id="alert-dialog-title">
                {t("auth:Reset 2FA and Password Modal.Raise 2FA Ticket")}
              </DialogTitle>
              <DialogContent dir={locale.rtl ? "rtl" : "ltr"}>
                <DialogContentText id="alert-dialog-description">
                  {t(
                    "auth:Reset 2FA and Password Modal.Do you want to raise a ticket to Emrgo support to reset your 2 Factor Authentication and password credentials"
                  )}
                  .
                  {t(
                    "auth:Reset 2FA and Password Modal.Only do this when you have forgotten your password and lost access to your authenticator app"
                  )}
                  .
                  {t(
                    "auth:Reset 2FA and Password Modal.Admin will use the file you upload to verify your account"
                  )}
                  .
                </DialogContentText>
                <div className={style["input-group"]}>
                  <Typography className={style["input-group__label"]}>{t("auth:Email")}</Typography>
                  <Field
                    component={TextField}
                    className={style.accordian__input}
                    name="email"
                    variant="outlined"
                  />
                </div>
                <Box>
                  <FileUploadField
                    label={t("auth:Reset 2FA and Password Modal.Identity Proof")}
                    // isLoading={filesUploadInProgress}
                    name="documentId"
                    fullWidth
                    acceptableFileTypes={ACCEPTABLE_FILE_TYPES}
                    customHandleChange={(e) =>
                      handleFileUpload({ files: e, keyName: "documentId", values })
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
                  {t("auth:Reset 2FA and Password Modal.Cancel")}
                </Button>
                <Button
                  onClick={() => raiseTicket(values)}
                  variant="contained"
                  type="submit"
                  color="primary"
                >
                  {t("auth:Reset 2FA and Password Modal.Yes, Reset it")}
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        )}
      </Formik>
    </Fragment>
  );
};

const ForgotPasswordPage = () => {
  const { t } = useTranslation(["auth"]);
  const authErrorMessage = useSelector(authSelectors.selectAuthErrorMessage);
  const hasSuccessfullyRequestedPasswordReset = useSelector(
    authSelectors.hasSuccessfullyRequestedPassword
  );

  return (
    <div className={style.container}>
      <h1>{t("auth:Reset your password")}</h1>
      {hasSuccessfullyRequestedPasswordReset ? (
        <ForgotPasswordEmailSuccess />
      ) : (
        <PasswordResetRequestForm />
      )}
      {authErrorMessage ? (
        <p style={{ color: "red", fontWeight: "bold", textTransform: "uppercase" }}>
          {authErrorMessage}
        </p>
      ) : null}
    </div>
  );
};

export default ForgotPasswordPage;
