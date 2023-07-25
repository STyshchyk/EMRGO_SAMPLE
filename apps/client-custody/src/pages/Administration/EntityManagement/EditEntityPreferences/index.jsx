import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { Form, Formik } from "formik";

import Checkbox from "../../../../components/Checkbox";
import LoadingPage from "../../../../components/LoadingPage";
import PageTitle from "../../../../components/PageTitle";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as entitiesActionCreators from "../../../../redux/actionCreators/entities";
import * as preferencesActionCreators from "../../../../redux/actionCreators/preferences";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../../redux/selectors/entities";
import * as preferencesSelectors from "../../../../redux/selectors/preferences";

const checkIfFormValuesAreModified = (initial, current) =>
  Object.keys(initial).some((key) => initial[key] !== current[key]);

// !!!DEV NOTE: By design, only entityPreferences.isActive sub-field determines the active status of each entity preference items in entityPreferences.preferences array sub-field so ignore isActive sub-field of preference item objects for now
const generateInitialValues = (listOfValidEntityPreferences, fetchedEntityPreferences) => {
  const activeEntityPreferences = fetchedEntityPreferences.filter(
    (entityPref) => entityPref.isActive
  );
  const listOfActiveEntityPreferenceKeys = activeEntityPreferences.map((i) => i.preferences.key);

  const transformed = listOfValidEntityPreferences.map((j) => ({
    [j.key]: listOfActiveEntityPreferenceKeys.includes(j.key),
  }));

  if (transformed.length > 0) {
    return Object.assign(...transformed);
  }

  return {};
};

const EditEntityPreferencesForm = ({ handleSubmit, entityPreferences }) => {
  // selectors
  const validListOfPreferences = useSelector(preferencesSelectors.selectValidListOfPreferences);
  const isSubmitting = useSelector(entitiesSelectors.selectIsSubmitting);

  const initialValues = generateInitialValues(validListOfPreferences, entityPreferences);

  return (
    <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, resetForm }) => {
        const isFormModified = checkIfFormValuesAreModified(initialValues, values);

        return (
          <Card>
            <CardContent>
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Checkbox label={"Four-eyes for Client"} name={"Payments/FourEyes"} />
                  </Grid>
                  <Grid item container xs={12} md={12} lg={12}>
                    <Button
                      type="button"
                      color="primary"
                      onClick={() => resetForm()}
                      disabled={isSubmitting || !isFormModified}
                    >
                      Reset Fields
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      data-testid="submit"
                      disabled={isSubmitting || !isFormModified}
                    >
                      Save Changes
                    </Button>
                  </Grid>
                  {isFormModified && (
                    <Grid item xs={12} md={12} lg={12}>
                      <strong
                        style={{
                          color: "red",
                        }}
                      >
                        * You have unsaved changes
                      </strong>
                    </Grid>
                  )}
                </Grid>
              </Form>
            </CardContent>
          </Card>
        );
      }}
    </Formik>
  );
};

const EditEntityPreferences = () => {
  const dispatch = useDispatch();
  const { entityId } = useParams();

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const isFetchingListOfPreferences = useSelector(preferencesSelectors.selectIsFetching);
  const entities = useSelector(entitiesSelectors.selectEntities);
  const currentlySelectedEntity = entities.find((i) => i.id === entityId);

  const currentEntityGroupID = currentEntityGroup?.id;
  const entityType = currentEntityGroup?.entityType;

  const isAdmin = entityType === "EMRGO_SERVICES";

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchListOfValidPreferences = () =>
      dispatch(preferencesActionCreators.doFetchPreferences());

    if (isAdmin) {
      fetchListOfValidPreferences();
    }
  }, [dispatch, isAdmin, currentEntityGroupID]);

  const handleSubmit = (values) => {
    const updateEntityPrefs = (payload) =>
      dispatch(entitiesActionCreators.doUpdateEntityPrefs(payload));

    const entityPreferences = Object.keys(values).map((i) => ({
      key: i,
      isActive: values[i],
    }));

    const requestPayload = {
      entityPreferences,
    };

    updateEntityPrefs({
      requestPayload,
      entityId,
    });
  };

  if (isFetchingListOfPreferences) {
    return <LoadingPage />;
  }

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={12}>
          <PageTitle title={`${currentlySelectedEntity.corporateEntityName}`} />
          <PageTitle title="Edit Entity Preferences" />
        </Grid>
      </Grid>
      <EditEntityPreferencesForm
        handleSubmit={handleSubmit}
        entityPreferences={currentlySelectedEntity?.entityPreferences}
      />
    </Fragment>
  );
};

export default EditEntityPreferences;
