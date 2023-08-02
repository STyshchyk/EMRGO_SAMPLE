// import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Form, Formik } from "formik";
import PropTypes from "prop-types";

import LoadingIndicator from "../../../../components/LoadingIndicator";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as entitiesActionCreators from "../../../../redux/actionCreators/entities";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as dropdownSelectors from "../../../../redux/selectors/dropdown";
import * as entitiesSelectors from "../../../../redux/selectors/entities";

const EditGroupTypesFormDialog = ({ entityId, initialValues, open, handleClose }) => {
  const dispatch = useDispatch();
  // const { t } = useTranslation(['administration']);
  const isSubmitting = useSelector(entitiesSelectors.selectIsSubmitting);
  const dropdownOptions = useSelector(dropdownSelectors.selectDropdownOptions);

  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const entityTypeDropdownOptions = dropdownOptions?.entityTypes ?? [];

  const normalizedEntityTypeOptions =
    entityTypeDropdownOptions
      .map((i) => ({
        label: i.name,
        value: i.key,
      }))
      ?.sort((a, b) => (a.label > b.label ? 1 : -1)) ?? [];

  // !NOTE: THIS ITEM IS NOT PROVIDED BY ENTITY TYPES DROPDOWN API
  normalizedEntityTypeOptions.push({
    label: "Wethaq Services",
    value: "EMRGO_SERVICES",
    isDisabled: true,
  });

  const editGroupTypes = (values) => {
    const updateEntityTypes = (payload) =>
      dispatch(entitiesActionCreators.doUpdateEntityTypes(payload));

    const payload = {
      entityId,
      requestPayload: {
        entityTypes: values.entityTypes,
      },
    };

    updateEntityTypes(payload);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        editGroupTypes(values, actions);
      }}
      enableReinitialize
    >
      {({ values, setFieldValue, handleSubmit }) => {
        const getEntityTypesFieldValue = () => {
          const updated = normalizedEntityTypeOptions
            .filter((item) => values?.entityTypes?.indexOf(item.value) >= 0)
            .map((filteredItem) => {
              if (initialValues?.entityTypes?.includes(filteredItem.value)) {
                return {
                  ...filteredItem,
                  isFixed: true,
                };
              }

              return {
                ...filteredItem,
              };
            });

          // TODO: REORDER ITEMS IN THE UPDATED LIST SO THAT FIXED ITEMS ARE PLACED AT THE BEGINNING OF THE LIST
          return updated;
        };
        return (
          <Form>
            <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="edit-group-types-form-dialog-title">
                <Grid container justifyContent="space-between">
                  <Grid item xs container alignContent="center">
                    <strong>Edit Entity's Group Types Form</strong>
                  </Grid>
                </Grid>
              </DialogTitle>
              <DialogContent>
                <Box pb={2}>
                  {isSubmitting ? (
                    <div>
                      <LoadingIndicator />
                      <p>Your form submission is being processed</p>
                    </div>
                  ) : (
                    <Grid container spacing={2}>
                      <Grid item container xs={12} md={12} lg={12}>
                        <Grid item xs={4} container direction="column" justifyContent="center">
                          <Typography>Entity Type(s)</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <FormControl className="w-full">
                            <Select
                              name="entityTypes"
                              value={getEntityTypesFieldValue()}
                              closeMenuOnSelect
                              isSearchable
                              isMulti
                              menuPortalTarget={document.body}
                              isClearable={false}
                              styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                multiValue: (base, state) =>
                                  state.data.isFixed ? { ...base, backgroundColor: "gray" } : base,
                                multiValueLabel: (base, state) =>
                                  state.data.isFixed
                                    ? {
                                        ...base,
                                        fontWeight: "bold",
                                        color: "white",
                                        paddingRight: 6,
                                      }
                                    : base,
                                multiValueRemove: (base, state) =>
                                  state.data.isFixed ? { ...base, display: "none" } : base,
                              }}
                              options={normalizedEntityTypeOptions}
                              onChange={(selectedOption) => {
                                if (selectedOption) {
                                  setFieldValue(
                                    "entityTypes",
                                    selectedOption.map((i) => i?.value)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              </DialogContent>
              <DialogActions>
                <Grid item container xs={12} md={12} lg={12} justifyContent="flex-end">
                  <Button type="button" color="primary" data-testid="cancel" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    data-testid="submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </Grid>
              </DialogActions>
            </Dialog>
          </Form>
        );
      }}
    </Formik>
  );
};

EditGroupTypesFormDialog.props = {
  initialValues: PropTypes.shape({
    entityTypes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default EditGroupTypesFormDialog;
