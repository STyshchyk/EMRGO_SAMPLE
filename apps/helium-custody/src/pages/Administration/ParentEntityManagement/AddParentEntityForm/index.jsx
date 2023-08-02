import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import PropTypes from "prop-types";

import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../../redux/selectors/entities";

const AddParentEntityForm = ({ initialValues, handleSubmit, handleClose }) => {
  const { t } = useTranslation(["administration"]);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const isSubmitting = useSelector(entitiesSelectors.selectIsSubmitting);
  const currentEntityGroupID = currentEntityGroup?.id;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {() => (
        <Form>
          <Grid container spacing={2}>
            <Grid item container xs={12} md={12} lg={12}>
              <Grid item xs={4} container direction="column" justifyContent="center">
                <Typography>Name</Typography>
              </Grid>
              <Grid item xs={8}>
                <Field
                  required
                  fullWidth
                  component={TextField}
                  name="name"
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
                <Typography>Description</Typography>
              </Grid>
              <Grid item xs={8}>
                <Field
                  required
                  fullWidth
                  component={TextField}
                  name="description"
                  multiline
                  rows={5}
                  variant="filled"
                  type="text"
                  inputProps={{
                    maxLength: 255,
                  }}
                />
              </Grid>
            </Grid>

            <Grid item container xs={12} md={12} lg={12} justifyContent="flex-end">
              <Button type="button" color="primary" data-testid="cancel" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                data-testid="submit"
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default AddParentEntityForm;

AddParentEntityForm.props = {
  initialValues: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};
