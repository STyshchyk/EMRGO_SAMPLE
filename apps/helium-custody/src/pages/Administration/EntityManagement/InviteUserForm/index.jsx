import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik } from "formik";
import { CheckboxWithLabel, TextField } from "formik-mui";
import PropTypes from "prop-types";

import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as onboardingSelectors from "../../../../redux/selectors/onboarding";
import { onboardUserFormSchema } from "../../../../validationSchemas";

const InviteUserForm = ({ handleSubmit, handleClose }) => {
  const { t } = useTranslation(["administration"]);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const isSubmitting = useSelector(onboardingSelectors.selectIsSubmitting);

  const currentEntityGroupID = currentEntityGroup?.id;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  return (
    <Formik
      initialValues={{
        email: "",
        firstName: "",
        middleName: "",
        lastName: "",
        isAdmin: false,
      }}
      onSubmit={handleSubmit}
      enableReinitialize
      validationSchema={onboardUserFormSchema}
    >
      {() => (
        <Form>
          <Grid container spacing={2}>
            <Grid item container xs={12} md={12} lg={12}>
              <Grid item xs={4} container direction="column" justifyContent="center">
                <Typography>{t("administration:Onboard User Form.Email")}</Typography>
              </Grid>
              <Grid item xs={8}>
                <Field
                  required
                  fullWidth
                  component={TextField}
                  name="email"
                  variant="filled"
                  type="text"
                  inputProps={{
                    maxLength: 40,
                  }}
                />
              </Grid>
            </Grid>

            <Grid item container xs={12} md={12} lg={12}>
              <Grid item xs={4} container direction="column" justifyContent="center">
                <Typography>{t("administration:Onboard User Form.First Name")}</Typography>
              </Grid>
              <Grid item xs={8}>
                <Field
                  required
                  fullWidth
                  component={TextField}
                  name="firstName"
                  variant="filled"
                  type="text"
                  inputProps={{
                    maxLength: 40,
                  }}
                />
              </Grid>
            </Grid>

            <Grid item container xs={12} md={12} lg={12}>
              <Grid item xs={4} container direction="column" justifyContent="center">
                <Typography>
                  {t("administration:Onboard User Form.Middle Name (Optional)")}
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Field
                  fullWidth
                  component={TextField}
                  name="middleName"
                  variant="filled"
                  type="text"
                  inputProps={{
                    maxLength: 40,
                  }}
                />
              </Grid>
            </Grid>

            <Grid item container xs={12} md={12} lg={12}>
              <Grid item xs={4} container direction="column" justifyContent="center">
                <Typography>{t("administration:Onboard User Form.Last Name")}</Typography>
              </Grid>
              <Grid item xs={8}>
                <Field
                  required
                  fullWidth
                  component={TextField}
                  name="lastName"
                  variant="filled"
                  type="text"
                  inputProps={{
                    maxLength: 40,
                  }}
                />
              </Grid>
            </Grid>
            <Field
              component={CheckboxWithLabel}
              type="checkbox"
              name="isAdmin"
              Label={{ label: t("administration:Onboard User Form.Set as Admin") }}
            />

            <Grid item container xs={12} md={12} lg={12} justifyContent="flex-end">
              <Button type="button" color="primary" data-testid="cancel" onClick={handleClose}>
                {t("administration:Onboard User Form.Cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                data-testid="submit"
                disabled={isSubmitting}
              >
                {t("administration:Onboard User Form.Submit")}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default InviteUserForm;

InviteUserForm.props = {
  initialValues: PropTypes.shape({
    userEmail: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    middleName: PropTypes.string,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};
