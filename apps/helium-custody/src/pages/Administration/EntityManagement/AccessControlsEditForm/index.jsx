import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Form, Formik } from "formik";

import Button from "../../../../components/Button";
import Checkbox from "../../../../components/Checkbox";
import * as entityGroupsActionCreators from "../../../../redux/actionCreators/entityGroups";
import * as accessControlsSelectors from "../../../../redux/selectors/accessControls";

const checkIfACLFormValuesAreModified = (initial, current) =>
  Object.keys(initial).some((key) => initial[key] !== current[key]);

const generateInitialValues = (validAccessControlNames, usersAccessControls) => {
  const listOfUsersAccessControlNames = usersAccessControls.map((i) => i.key);

  const transformed = validAccessControlNames.map((j) => ({
    [j.key]: listOfUsersAccessControlNames.includes(j.key),
  }));

  if (transformed.length > 0) {
    return Object.assign(...transformed);
  }

  return {};
};

const AccessControlsEditForm = ({ usersAccessControls, readOnly, userId }) => {
  const dispatch = useDispatch();
  const { groupId } = useParams();

  // selectors
  const listOfValidACLNames = useSelector(accessControlsSelectors.selectListOfValidACLNames);
  const isFetching = useSelector(accessControlsSelectors.selectIsFetching);

  const initialValues = generateInitialValues(listOfValidACLNames, usersAccessControls);

  const handleSubmit = (values) => {
    const listOfEnabledAccessControlNames = Object.keys(values).filter((key) => values[key]);

    const requestPayload = {
      accessControlKeys: listOfEnabledAccessControlNames,
    };

    const requestEntityGroupUserEdit = (payload) =>
      dispatch(entityGroupsActionCreators.doRequestEntityGroupUserEdit(payload));
    requestEntityGroupUserEdit({
      requestPayload,
      groupId,
      userId,
    });
  };

  if (isFetching) {
    return <h3>Loading ACL data...</h3>;
  }

  return (
    <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, resetForm }) => {
        const isFormModified = checkIfACLFormValuesAreModified(initialValues, values);

        return (
          <Card>
            <CardContent>
              <h3>Access Controls Edit Form</h3>
              <Form>
                {listOfValidACLNames.map((i) => (
                  <div
                    key={i.key}
                    style={{
                      marginBottom: "1rem",
                    }}
                  >
                    <Checkbox key={i.key} label={i.key} name={i.key} readOnly={readOnly} />
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      marginRight: "1rem",
                    }}
                  >
                    <Button size="large" disabled={!isFormModified} onClick={() => resetForm()}>
                      Reset Fields
                    </Button>
                  </div>
                  <Button type="submit" size="large" disabled={!isFormModified}>
                    Save Changes
                  </Button>
                </div>
                {isFormModified && (
                  <div>
                    <strong
                      style={{
                        color: "red",
                      }}
                    >
                      * You have unsaved changes
                    </strong>
                  </div>
                )}
              </Form>
            </CardContent>
          </Card>
        );
      }}
    </Formik>
  );
};

export default AccessControlsEditForm;
