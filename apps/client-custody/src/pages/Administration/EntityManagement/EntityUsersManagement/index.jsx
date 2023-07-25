import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import MaterialTable from "@material-table/core";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import AssignAdminModal from "../../../../components/AssignAdminModal";
import DeactivateUserModal from "../../../../components/DeactivateUserModal";
import DeassignAdminModal from "../../../../components/DeassignAdminModal";
import LoadingIndicator from "../../../../components/LoadingIndicator";
import LoadingPage from "../../../../components/LoadingPage";
import MaterialTableOverflowMenu from "../../../../components/MaterialTableOverflowMenu";
import PageTitle from "../../../../components/PageTitle";
import ReactivateUserModal from "../../../../components/ReactivateUserModal";
import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as entitiesActionCreators from "../../../../redux/actionCreators/entities";
import * as onboardingActionCreators from "../../../../redux/actionCreators/onboarding";
import * as usersActionCreators from "../../../../redux/actionCreators/users";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../../redux/selectors/entities";
import * as onboardingSelectors from "../../../../redux/selectors/onboarding";
import * as usersSelectors from "../../../../redux/selectors/users";
import tableStyles from "../../../../styles/cssInJs/materialTable";
import InviteUserForm from "../InviteUserForm";

// TODO: DRY UP

const InviteUserDialog = ({ entityId, open, handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["administration"]);
  const isSubmitting = useSelector(onboardingSelectors.selectIsSubmitting);

  const handleSubmit = (values) => {
    const inviteUser = (payload) => dispatch(onboardingActionCreators.doInviteUserRequest(payload));

    const requestPayload = {
      ...values,
      entityId,
    };

    inviteUser({
      requestPayload,
      entityId,
      successCallback: () => {
        const fetchEntityUsers = (payload) =>
          dispatch(entitiesActionCreators.doFetchEntityUsers(payload));

        fetchEntityUsers({ entityId });
        handleClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="add-parent-entity-form-dialog-title">
        <Grid container justifyContent="space-between">
          <Grid item xs container alignContent="center">
            <strong>{t("administration:Onboard User Form.Onboard User Form")}</strong>
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
            <InviteUserForm handleSubmit={handleSubmit} handleClose={handleClose} />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const createEntityUsersTableData = (entityUser) => ({
  id: entityUser.id,
  email: entityUser.email,
  firstName: entityUser.firstName,
  middleName: entityUser.middleName,
  lastName: entityUser.lastName,
  isActive: entityUser.isActive,
  isVerified: entityUser.isVerified,
  isAdmin: entityUser.isAdmin,
  wethaqUserId: entityUser.wethaqUserId,
});

const EntityUsersManagement = () => {
  const dispatch = useDispatch();
  const { groupId, entityId } = useParams();
  const { t } = useTranslation(["onboarding", "administration"]);
  const mtableLocalization = useMaterialTableLocalization();

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(false);
  const [openInviteUserDialog, setOpenInviteUserDialog] = useState(false);
  const [openDeactivateUserDialog, setOpenDeactivateUserDialog] = useState(false);
  const [openReactivateUserDialog, setOpenReactivateUserDialog] = useState(false);
  const [openAssignAdminDialog, setOpenAssignAdminDialog] = useState(false);
  const [openUnassignAdminDialog, setOpenUnassignAdminDialog] = useState(false);

  const entityUsers = useSelector(entitiesSelectors.selectEntityUsers);
  const entities = useSelector(entitiesSelectors.selectEntities);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const isFetchingEntityUsers = useSelector(entitiesSelectors.selectIsFetching);

  const currentEntityGroupID = currentEntityGroup?.id;

  const currentlySelectedEntity = entities.find((i) => i.id === entityId);
  const isAdmin = ["EMRGO_SERVICES"].includes(currentEntityGroup.entityType);

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchEntityUsers = (payload) =>
      dispatch(entitiesActionCreators.doFetchEntityUsers(payload));

    fetchEntityUsers({
      entityId,
    });
  }, [dispatch, groupId, currentEntityGroupID, entityId]);

  if (isFetchingEntityUsers) {
    return <LoadingPage />;
  }

  const handleDeactivateUserOpen = () => {
    setOpenDeactivateUserDialog(true);
  };

  const handleReactivateUserOpen = () => {
    setOpenReactivateUserDialog(true);
  };

  const handleAssignAdminOpen = () => {
    setOpenAssignAdminDialog(true);
  };

  const handleUnassignAdminOpen = () => {
    setOpenUnassignAdminDialog(true);
  };

  const deactivateEntity = (requestPayload, userId) => {
    dispatch(
      usersActionCreators.doUpdateUserAccountStatus({
        requestPayload,
        userId,
        entityId,
        verified: false,
        refresh: { type: "entityUsers", params: { entityId } },
      })
    );
    setOpenDeactivateUserDialog(false);
  };

  const reactivateEntity = (requestPayload, userId) => {
    dispatch(
      usersActionCreators.doUpdateUserAccountStatus({
        requestPayload,
        userId,
        entityId,
        verified: false,
        refresh: { type: "entityUsers", params: { entityId } },
      })
    );
    setOpenReactivateUserDialog(false);
  };

  const assignUserAdmin = (requestPayload, userId) => {
    dispatch(
      usersActionCreators.doUpdateUserAccountStatus({
        requestPayload,
        userId,
        entityId,
        verified: false,
        refresh: { type: "entityUsers", params: { entityId } },
      })
    );
    setOpenAssignAdminDialog(false);
  };

  const deassignUserAdmin = (requestPayload, userId) => {
    dispatch(
      usersActionCreators.doUpdateUserAccountStatus({
        requestPayload,
        userId,
        entityId,
        verified: false,
        refresh: { type: "entityUsers", params: { entityId } },
      })
    );
    setOpenUnassignAdminDialog(false);
  };

  const actions = [
    {
      callback: handleReactivateUserOpen,
      icon: <LockOpenIcon fontSize="small" />,
      label: t("onboarding:Actions.Reactivate User"),
      disabled: selectedRow?.isActive,
      hidden: !isAdmin,
    },
    {
      callback: handleDeactivateUserOpen,
      icon: <LockIcon fontSize="small" />,
      label: t("onboarding:Actions.Deactive User"),
      disabled: !selectedRow?.isActive,
      hidden: !isAdmin,
    },
    {
      callback: handleAssignAdminOpen,
      icon: <PersonIcon fontSize="small" />,
      label: t("onboarding:Actions.Assign Admin"),
      disabled: selectedRow?.isAdmin,
    },
    {
      callback: handleUnassignAdminOpen,
      icon: <PersonOutlineIcon fontSize="small" />,
      label: t("onboarding:Actions.Unassign Admin"),
      disabled: !selectedRow?.isAdmin,
    },
  ];

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={6}>
          <PageTitle title={currentlySelectedEntity.corporateEntityName} />
          <PageTitle title="Manage Entity Users" />
        </Grid>
        <Grid item xs={6} container justifyContent="flex-end" alignItems="flex-start">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenInviteUserDialog(true);
            }}
          >
            Onboard User
          </Button>
        </Grid>
      </Grid>

      <MaterialTable
        size="small"
        title="Entity Users"
        columns={[
          {
            title: "User ID",
            field: "wethaqUserId",
          },
          {
            title: "User Account Status",
            field: "isActive",
            render: (rowData) =>
              rowData.isActive ? (
                <strong style={{ color: "green" }}>Active</strong>
              ) : (
                <strong style={{ color: "red" }}>Inactive</strong>
              ),
          },
          {
            title: "Email",
            field: "email",
            defaultSort: "asc",
          },
          {
            title: "First Name",
            field: "firstName",
          },
          {
            title: "Middle Name",
            field: "middleName",
          },
          {
            title: "Last Name",
            field: "lastName",
          },
          {
            title: "Is Verified?",
            field: "isVerified",
            render: (rowData) => (rowData.isVerified ? "Yes" : "No"),
          },
          {
            title: "Is Admin?",
            field: "isAdmin",
            render: (rowData) => (rowData.isAdmin ? "Yes" : "No"),
          },
        ]}
        data={entityUsers.map((i) => createEntityUsersTableData(i))}
        options={{
          ...tableStyles,
          // searchFieldVariant: 'filled',
          pageSize: 20,
          actionsColumnIndex: -1,
        }}
        actions={[
          {
            icon: "more_vert",
            onClick: (event, rowData) => {
              setMenuAnchorEl(event.currentTarget);
              setSelectedRow(rowData);
            },
          },
        ]}
        localization={mtableLocalization}
      />
      <MaterialTableOverflowMenu
        actions={actions}
        anchorEl={menuAnchorEl}
        setAnchorEl={setMenuAnchorEl}
        selectedRow={selectedRow}
      />
      <InviteUserDialog
        entityId={entityId}
        open={openInviteUserDialog}
        handleClose={() => setOpenInviteUserDialog(false)}
      />
      <DeactivateUserModal
        open={openDeactivateUserDialog}
        onClose={() => setOpenDeactivateUserDialog(false)}
        selectedRow={selectedRow}
        deactivateEntity={deactivateEntity}
      />
      <ReactivateUserModal
        open={openReactivateUserDialog}
        onClose={() => setOpenReactivateUserDialog(false)}
        selectedRow={selectedRow}
        reactivateEntity={reactivateEntity}
      />
      <AssignAdminModal
        open={openAssignAdminDialog}
        onClose={() => setOpenAssignAdminDialog(false)}
        selectedRow={selectedRow}
        assignUserAdmin={assignUserAdmin}
        entityId={entityId}
      />
      <DeassignAdminModal
        open={openUnassignAdminDialog}
        onClose={() => setOpenUnassignAdminDialog(false)}
        selectedRow={selectedRow}
        deassignUserAdmin={deassignUserAdmin}
        entityId={entityId}
      />
    </Fragment>
  );
};

export default EntityUsersManagement;
