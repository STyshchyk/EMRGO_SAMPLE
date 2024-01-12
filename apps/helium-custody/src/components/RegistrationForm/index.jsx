import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";

// import { TextField } from 'formik-mui';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik } from "formik";
import PropTypes from "prop-types";

import routes from "../../constants/routes";
import { setPasswordsSchema } from "../../validationSchemas";
import ActionButton from "../ActionButton";
import style from "./style.module.scss";

const initialValues = {
  password: "",
  confirmPassword: "",
};

const RegistrationForm = ({ requestPasswordReset, resetPasswordSuccess }) => {
  const { t } = useTranslation(["auth"]);
  const { token } = useParams();
  // const [isSuccessfullyRegistered, setIsSuccessfullyRegistered] = useState(false);
  return (
    <Fragment>
      <Formik
        initialValues={initialValues}
        validationSchema={setPasswordsSchema}
        validateOnMount
        validateOnChange
        validateOnBlur
        onSubmit={(values) => {
          const requestPayload = {
            ...values,
            token,
            caller: "RegistrationForm",
          };
          requestPasswordReset(requestPayload);
        }}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <div className={style.container}>
            {resetPasswordSuccess ? <Navigate to={routes.authentication.success} /> : ""}
            <Form className={style.form} data-testid="registration-form">
              <span className={style.form__descriptor}>
                {t("auth:Create a Password for your account")}
                <br />
                {t("auth:Your Username is the Email Id on which you received this link")}
              </span>
              <Field
                validate
                value={values.password}
                onChange={(e) => setFieldValue("password", e.target.value)}
                fullWidth
                component={TextField}
                label={t("auth:Password")}
                name="password"
                variant="outlined"
                type="password"
              />
              {errors.password && <Typography variant="caption">{errors.password}</Typography>}
              <br />
              <Field
                validate
                fullWidth
                value={values.confirmPassword}
                onChange={(e) => setFieldValue("confirmPassword", e.target.value)}
                component={TextField}
                label={t("auth:Confirm Password")}
                name="confirmPassword"
                variant="outlined"
                type="password"
                data-testid="confirmPassword"
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <Typography variant="caption">{errors.confirmPassword}</Typography>
              )}
              <br />
              <ActionButton
                type="submit"
                text={t("auth:Complete Registration")}
                hideArrow
                logoColor
              />
            </Form>
          </div>
        )}
      </Formik>
    </Fragment>
  );
};

RegistrationForm.propTypes = {
  requestPasswordReset: PropTypes.func.isRequired,
  resetPasswordSuccess: PropTypes.bool.isRequired,
};

export default RegistrationForm;
