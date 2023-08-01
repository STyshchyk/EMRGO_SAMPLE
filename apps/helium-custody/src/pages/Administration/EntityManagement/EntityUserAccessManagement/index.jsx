import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";

import LoadingIndicator from "../../../../components/LoadingIndicator";
import LoadingPage from "../../../../components/LoadingPage";
import PageTitle from "../../../../components/PageTitle";
import accessControlsList from "../../../../constants/accessControlsList";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as accessControlsActionCreators from "../../../../redux/actionCreators/accessControls";
import * as entitiesActionCreators from "../../../../redux/actionCreators/entities";
import { doFetchEntityGroupDetails } from "../../../../redux/actionCreators/entityGroups";
import * as entityGroupsActionCreators from "../../../../redux/actionCreators/entityGroups";
import * as accessControlsSelectors from "../../../../redux/selectors/accessControls";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../../redux/selectors/entities";
import { selectEntityGroupIsLoading } from "../../../../redux/selectors/entityGroups";
import * as entityGroupsSelectors from "../../../../redux/selectors/entityGroups";
import AccessControlsEditForm from "../AccessControlsEditForm";
import AttachEntityUserToEGForm from "../AttachEntityUserToEGForm";

const UsersList = ({ readOnly, entityGroupDetails, currentEntityGroupID }) => {
  const { t } = useTranslation(["administration"]);
  const dispatch = useDispatch();

  const isLoading = useSelector(selectEntityGroupIsLoading);

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchAccessControls = (payload) =>
      dispatch(accessControlsActionCreators.doFetchAccessControls(payload));

    if (entityGroupDetails?.entityType) {
      fetchAccessControls({
        params: {
          type: entityGroupDetails?.entityType,
        },
      });
    }
    return () => {
      const resetAccessControlsState = () =>
        dispatch(accessControlsActionCreators.doResetAccessControlsState());

      resetAccessControlsState();
    };
  }, [entityGroupDetails?.entityType, dispatch]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (entityGroupDetails?.users?.length > 0) {
    const { users } = entityGroupDetails;

    return (
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Card
              style={{
                marginBottom: "2rem",
              }}
            >
              <CardContent>
                <p>
                  <strong>
                    {t("administration:EntityManagement.SingleEntityGroup.UsersList.Full Name")}:{" "}
                  </strong>
                  {`${user.firstName} ${user.lastName}`}
                </p>
                <p>
                  <strong>
                    {t("administration:EntityManagement.SingleEntityGroup.UsersList.Email")}:{" "}
                  </strong>
                  {user.email}
                </p>
                <AccessControlsEditForm
                  currentEntityGroupID={currentEntityGroupID}
                  usersAccessControls={user.accessControls}
                  readOnly={readOnly}
                  useEffect
                  entityType={entityGroupDetails.entityType}
                  userId={user.id}
                />
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    );
  }

  return null;
};

const AttachEntityUserToEGDialog = ({ entityId, entityGroupId, open, handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["administration"]);
  const isSubmitting = useSelector(entityGroupsSelectors.selectIsSubmitting);
  const entityUsers = useSelector(entitiesSelectors.selectEntityUsers);
  const listOfActiveACLKeys = useSelector(accessControlsSelectors.selectListOfACLKeys);

  const entityUserOptions = entityUsers.map((i) => ({
    label: `${i.firstName} ${i.lastName}`,
    value: i.id,
  }));

  const handleSubmit = (values, actions) => {
    const attachEntityUserToTheEG = (payload) =>
      dispatch(entityGroupsActionCreators.doAttachEntityUserToEntityGroup(payload));

    const requestPayload = {
      isAdmin: false,
      userId: values.entityUserId,
      entityId,
      accessControlKeys: listOfActiveACLKeys,
    };

    attachEntityUserToTheEG({
      requestPayload,
      entityGroupId,
    });

    actions.resetForm();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="attach-entity-user-to-entity-group-form-dialog-title">
        <Grid container justifyContent="space-between">
          <Grid item xs container alignContent="center">
            <strong>Attach Entity User to the Entity Group Form</strong>
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
            <AttachEntityUserToEGForm
              initialValues={{
                entityUserId: "",
              }}
              handleSubmit={handleSubmit}
              handleClose={handleClose}
              options={{
                entityUserOptions,
              }}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const EntityUserAccessManagement = () => {
  const dispatch = useDispatch();
  const { groupId, entityId } = useParams();

  const [openAddEntityUserDialog, setOpenAddEntityUserDialog] = useState(false);

  // selectors
  const entityGroupDetails = useSelector(entityGroupsSelectors.selectEntityGroupDetails);
  const isFetchingEntityGroupDetails = useSelector(
    entityGroupsSelectors.selectEntityGroupIsLoading
  );
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentListOfAcls = useSelector(authSelectors.selectCurrentListOfAcls);
  const entities = useSelector(entitiesSelectors.selectEntities);
  const isFetchingEntityUsers = useSelector(entitiesSelectors.selectIsFetching);

  const hasEditACLManagementPermission = currentListOfAcls.includes(
    accessControlsList.ACL_MANAGEMENT.edit.key
  );

  const currentEntityGroupID = currentEntityGroup?.id;
  const currentlySelectedEntity = entities.find((i) => i.id === entityId);

  useEffect(() => {
    const fetchEntityGroupDetailsByID = (payload) => dispatch(doFetchEntityGroupDetails(payload));

    const fetchEntityUsers = (payload) =>
      dispatch(entitiesActionCreators.doFetchEntityUsers(payload));

    fetchEntityUsers({
      entityId,
    });

    fetchEntityGroupDetailsByID({ id: groupId });
  }, [dispatch, groupId, currentEntityGroupID, entityId]);

  if (isFetchingEntityGroupDetails || isFetchingEntityUsers) {
    return <LoadingPage />;
  }

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={9}>
          <PageTitle
            title={`${currentlySelectedEntity?.corporateEntityName} - ${entityGroupDetails?.name}`}
          />
          <PageTitle title={"Manage Entity Groups"} />
        </Grid>
        <Grid item xs={3} container justifyContent="flex-end" alignItems="flex-start">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenAddEntityUserDialog(true);
            }}
          >
            Add Entity User To This Entity Group
          </Button>
        </Grid>
      </Grid>

      <UsersList
        currentEntityGroupID={currentEntityGroupID}
        readOnly={!hasEditACLManagementPermission}
        entityGroupDetails={entityGroupDetails}
      />
      <AttachEntityUserToEGDialog
        entityId={entityId}
        entityGroupId={groupId}
        open={openAddEntityUserDialog}
        handleClose={() => setOpenAddEntityUserDialog(false)}
      />
    </Fragment>
  );
};

export default EntityUserAccessManagement;
