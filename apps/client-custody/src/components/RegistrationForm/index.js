import { Fragment } from 'react';
import { Formik, Form, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Redirect, useParams } from 'react-router-dom';
// import { TextField } from 'formik-material-ui';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ActionButton from '../ActionButton';
import routes from '../../constants/routes';

import style from './style.module.scss';

import { setPasswordsSchema } from '../../validationSchemas';

const initialValues = {
  password: '',
  confirmPassword: '',
};

const RegistrationForm = ({ requestPasswordReset, resetPasswordSuccess }) => {
  const { t } = useTranslation(['auth']);
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
            caller: 'RegistrationForm',
          };
          requestPasswordReset(requestPayload);
        }}
      >
        {({ errors, touched, values, setFieldValue }) => (
          <div className={style.container}>
            {resetPasswordSuccess ? <Redirect to={routes.authentication.success} /> : ''}
            <Form className={style.form} data-testid="registration-form">
              <span className={style.form__descriptor}>
                {t('auth:Create a Password for your account')}
                <br />
                {t('auth:Your Username is the Email Id on which you received this link')}
              </span>
              <Field
                validate
                value={values.password}
                onChange={(e) => setFieldValue('password', e.target.value)}
                fullWidth
                component={TextField}
                label={t('auth:Password')}
                name="password"
                variant="filled"
                type="password"
              />
              {errors.password && <Typography variant="caption">{errors.password}</Typography>}
              <br />
              <Field
                validate
                fullWidth
                value={values.confirmPassword}
                onChange={(e) => setFieldValue('confirmPassword', e.target.value)}
                component={TextField}
                label={t('auth:Confirm Password')}
                name="confirmPassword"
                variant="filled"
                type="password"
                data-testid="confirmPassword"
              />
              {errors.confirmPassword && touched.confirmPassword && <Typography variant="caption">{errors.confirmPassword}</Typography>}
              <br />
              <ActionButton type="submit" text={t('auth:Complete Registration')} hideArrow logoColor />
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
