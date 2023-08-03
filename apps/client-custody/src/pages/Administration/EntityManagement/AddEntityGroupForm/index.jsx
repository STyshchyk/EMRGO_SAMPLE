import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Select } from "@emrgo-frontend/shared-ui";

import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import PropTypes from "prop-types";

import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as entityGroupsSelectors from "../../../../redux/selectors/entityGroups";
import style from "./style.module.scss";

const AddEntityGroupForm = ({ initialValues, handleSubmit, handleClose, options }) => {
  const { t } = useTranslation(["administration"]);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const isSubmitting = useSelector(entityGroupsSelectors.selectIsSubmitting);
  const currentEntityGroupID = currentEntityGroup?.id;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ setFieldValue }) => (
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
                <Typography>Entity Type</Typography>
              </Grid>
              <Grid item xs={8}>
                <FormControl className={style.input__form_control}>
                  <Select
                    name="entityType"
                    placeholder={"Select Entity Type"}
                    closeMenuOnSelect
                    isSearchable
                    menuPortalTarget={document.body}
                    isClearable
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    options={options?.validGroupTypeOptions}
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setFieldValue("entityType", selectedOption.value);
                      }
                    }}
                  />
                </FormControl>
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

export default AddEntityGroupForm;

AddEntityGroupForm.props = {
  initialValues: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};
