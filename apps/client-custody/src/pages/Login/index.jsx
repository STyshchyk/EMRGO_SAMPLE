import { Fragment, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Form, Formik } from "formik";

import appConfig from "../../appConfig";
import AnimatedInputField from "../../components/AnimatedInputField";
import Button from "../../components/Button";
import LoadingIndicator from "../../components/LoadingIndicator";
import locales from "../../constants/locales/locales";
import routes from "../../constants/routes";
import { doLoginUser } from "../../redux/actionCreators/auth";
import {
  selectAuthenticatedUserObject,
  selectIsUserAuthenticated,
  selectIsUserLoggingIn,
} from "../../redux/selectors/auth";
import { loginFormSchema } from "../../validationSchemas";
import style from "./style.module.scss";

const LoginForm = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation(["auth"]);
  const currentLang = i18n.language;
  const locale = locales.find(({ code }) => code === currentLang);

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        language: {
          value: locale ? locale.code : "en-GB",
          label: locale ? locale.name : "English",
        },
      }}
      onSubmit={(values) => {
        const loginUser = (payload) => dispatch(doLoginUser(payload));

        const requestPayload = { ...values };

        loginUser({
          requestPayload,
          /*
          successCallback: () => {
            // Execute post user authentication tasks
          },
          */
        });
      }}
      validationSchema={loginFormSchema}
    >
      {({ isValid }) => (
        <Form className={style.form} data-testid="login-form">
          <AnimatedInputField name="email" label={t("Corporate Email ID")} />
          <AnimatedInputField name="password" label={t("Password")} type="password" />
          <div className={style.action__wrapper}>
            <Link to={routes.authentication.forgotPassword}>
              <Button variant="text" size="large" color="primary">
                <span className="btn-text  ">{t("Forgot Password?")}</span>
              </Button>
            </Link>
            <Button
              disabled={!isValid}
              type="submit"
              variant="contained"
              size="large"
              data-testid="submit"
              id="loginButton"
            >
              <span className="btn-text  ">{t("Proceed")}</span>
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(["auth"]);
  const isAuthenticated = useSelector(selectIsUserAuthenticated);
  const userObject = useSelector(selectAuthenticatedUserObject);
  const isUserLoggingIn = useSelector(selectIsUserLoggingIn);
  const is2FAEnabled = false;

  useLayoutEffect(() => {
    if (isAuthenticated) {
      if (is2FAEnabled && userObject.MFAActive) {
        const { from } = location.state || { from: { pathname: routes.authentication.otp } };
        navigate(from);
      } else {
        const { from } = location.state || { from: { pathname: routes.dashboard.home } };
        // const { from } = location.state || { from: { pathname: routes.authentication.setupMFA } };
        navigate(from);
      }
    }
  }, [isAuthenticated, location.state, userObject, is2FAEnabled, navigate]);

  if (isUserLoggingIn) {
    return <LoadingIndicator />;
  }

  return (
    <div className={style.container} data-testid="login-container">
      <h1 className="form-title form-title--secondary">{t("Log In")}</h1>
      <LoginForm />
    </div>
  );
};

export default Login;
