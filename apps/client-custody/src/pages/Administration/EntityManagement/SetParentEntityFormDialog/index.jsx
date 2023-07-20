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

import LoadingIndicator from "../../../../components/LoadingIndicator";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as entitiesActionCreators from "../../../../redux/actionCreators/entities";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../../redux/selectors/entities";

const SetParentEntityFormDialog = ({ entityId, initialValues, open, handleClose }) => {
  const dispatch = useDispatch();
  // const { t } = useTranslation(['administration']);
  const isSubmitting = useSelector(entitiesSelectors.selectIsSubmitting);
  const parentEntities = useSelector(entitiesSelectors.selectParentEntities);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentEntityGroupID = currentEntityGroup?.id;

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  const parentEntityOptions = parentEntities.map((i) => ({
    label: i.entityParentName,
    value: i.id,
  }));

  const editParentEntity = (values, actions) => {
    const setParentEntity = (payload) =>
      dispatch(entitiesActionCreators.doSetParentEntityId(payload));

    const requestPayload = {
      // NOTE: Required field name should be parentEntityId instead of entityParentId
      entityParentId: values.parentEntityId,
    };

    setParentEntity({
      entityId,
      requestPayload,
    });

    actions.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        editParentEntity(values, actions);
      }}
      enableReinitialize
    >
      {({ values, setFieldValue, handleSubmit }) => {
        const getParentEntityFieldValue = () =>
          parentEntityOptions.find((option) => option.value === values.parentEntityId) ?? null;

        return (
          <Form>
            <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="edit-group-types-form-dialog-title">
                <Grid container justifyContent="space-between">
                  <Grid item xs container alignContent="center">
                    <strong>Edit Entity's Parent Entity</strong>
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
                          <Typography>Parent Entity</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <FormControl className="w-full">
                            <Select
                              name="parentEntityId"
                              value={getParentEntityFieldValue()}
                              closeMenuOnSelect
                              isSearchable
                              menuPortalTarget={document.body}
                              isClearable
                              styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              }}
                              options={parentEntityOptions}
                              onChange={(selectedOption) => {
                                if (selectedOption) {
                                  setFieldValue("parentEntityId", selectedOption.value);
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>

                      {/* <Grid item container xs={12} md={12} lg={12} justify="flex-end">
                        <Button type="button" color="primary" data-testid="cancel" onClick={handleClose}>
                          Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" data-testid="submit" disabled={isSubmitting}>
                          Submit
                        </Button>
                      </Grid> */}
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

SetParentEntityFormDialog.propTypes = {};

export default SetParentEntityFormDialog;
