import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useMatch, useParams } from "react-router-dom";

import { mdiCheckCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";
import Link from "@mui/material/Link";
import { Form, Formik } from "formik";
import jwtDecode from "jwt-decode";

import AnimatedInputField from "../../components/AnimatedInputField";
import Button from "../../components/Button";
import Flex from "../../components/Flex";
import routes from "../../constants/routes";
import * as authActionCreators from "../../redux/actionCreators/auth";
import * as authSelectors from "../../redux/selectors/auth";
import { setPasswordsSchema } from "../../validationSchemas";
import style from "./style.module.scss";

const ResetPasswordSuccess = () => {
  const { t } = useTranslation(["auth"]);
  const { token } = useParams();
  const decodedToken = jwtDecode(token);

  return (
    <div className={style.container}>
      <div className={style.success}>
        <div className={style.success__icon__wrapper}>
          <Icon
            className={style.success__icon}
            path={mdiCheckCircleOutline}
            size={8}
            title="Action Complete"
          />
        </div>
        <span className={style.success__descriptor}>
          {t("auth:You have successfully reset your password")}
          <br />
          {t("auth:Please login with your username")} &quot;
          <span className={style["success__descriptor--bold"]}>{decodedToken?.email}</span> &quot;{" "}
          {t("auth:and new password")}
        </span>
        <Flex width="100" justify="center">
          <Link to={routes.public.login} component={RouterLink}>
            {t("auth:Buttons.Return to login page")}
          </Link>
        </Flex>{" "}
      </div>
    </div>
  );
};

const ResetPasswordForm = () => {
  const { t } = useTranslation(["auth"]);
  const { token } = useParams();
  const decodedToken = jwtDecode(token);
  const isResetPasswordAndMFARoute = useMatch(routes.authentication.resetMFAAndPassword);

  const dispatch = useDispatch();
  const isRequesting = useSelector(authSelectors.selectIsRequesting);

  const handleSubmit = (values) => {
    const requestPayload = {
      ...values,
      token,
    };

    if (isResetPasswordAndMFARoute) {
      const requestPasswordAndMFAReset = (payload) =>
        dispatch(authActionCreators.doPasswordAndMFAReset(payload));
      requestPasswordAndMFAReset(requestPayload);
    } else {
      const requestPasswordReset = (payload) =>
        dispatch(authActionCreators.doPasswordReset(payload));
      requestPasswordReset(requestPayload);
    }
  };

  return (
    <Formik
      initialValues={{
        password: "",
        confirmPassword: "",
      }}
      validationSchema={setPasswordsSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className={style.form}>
          <span className={style.form__descriptor}>
            {t("auth:Create a new password for your account with username")} “
            <span className={style["form__descriptor--bold"]}>{decodedToken?.email}</span>”
          </span>
          <AnimatedInputField name="password" type="password" label={t("auth:Password")} />
          <AnimatedInputField
            name="confirmPassword"
            label={t("auth:Confirm Password")}
            type="password"
          />
          <br />
          <Button
            type="submit"
            variant="contained"
            disabled={isRequesting}
            size="large"
            data-testid="submit"
          >
            <span className="btn-text  ">{t("auth:Buttons.Reset Password")}</span>
          </Button>
          <br />
          <Flex width="100" justify="center">
            <Link to={routes.public.login} component={RouterLink}>
              {t("auth:Buttons.Return to login page")}
            </Link>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

const ResetPasswordPage = () => {
  const { t } = useTranslation(["auth"]);
  const isResetPasswordAndMFARoute = useMatch(routes.authentication.resetMFAAndPassword);
  const authErrorMessage = useSelector(authSelectors.selectAuthErrorMessage);
  const hasSuccessfullyResetPassword = useSelector(authSelectors.hasSuccessfullyResetPassword);

  return (
    <div className={style.container}>
      <h1>
        {t("auth:Reset your password")} {isResetPasswordAndMFARoute ? "and 2FA" : ""}
      </h1>
      {hasSuccessfullyResetPassword ? <ResetPasswordSuccess /> : <ResetPasswordForm />}
      {authErrorMessage ? (
        <p style={{ color: "red", fontWeight: "bold", textTransform: "uppercase" }}>
          {authErrorMessage}
        </p>
      ) : null}
    </div>
  );
};

export default ResetPasswordPage;
