import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import MaterialTable from "@material-table/core";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import BallotIcon from "@mui/icons-material/Ballot";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DescriptionIcon from "@mui/icons-material/Description";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SettingsIcon from "@mui/icons-material/Settings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { capitalCase } from "change-case";
import { reverse } from "named-urls";
import PropTypes from "prop-types";

import AssignEntityModal from "../../../../components/AssignEntityModal";
import LoadingPage from "../../../../components/LoadingPage";
import MaterialTableOverflowMenu from "../../../../components/MaterialTableOverflowMenu";
import routes from "../../../../constants/routes";
import { titleRenderer } from "../../../../helpers/renderers";
import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";
import * as entitiesActionCreators from "../../../../redux/actionCreators/entities";
import * as kycActionCreators from "../../../../redux/actionCreators/kyc";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../../redux/selectors/entities";
import tableStyles from "../../../../styles/cssInJs/materialTable";
import useIsProduction from "../../../../utils/useIsProduction";
import DeactivateEntityModal from "../DeactivateEntityModal";
import EditCustodySettingsFormDialog from "../EditCustodySettingsFormDialog";
import EditGroupTypesFormDialog from "../EditGroupTypesFormDialog";
import ReactivateEntityModal from "../ReactivateEntityModal";
import SetParentEntityFormDialog from "../SetParentEntityFormDialog";
import ViewKYCModal from "../ViewKYCModal";

const EntitiesTable = ({ tableData }) => {
  const { t } = useTranslation(["administration"]);
  const inProd = useIsProduction();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isFetching = useSelector(entitiesSelectors.selectIsFetching);
  const entitiesList = useSelector(entitiesSelectors.selectEntities);
  const userAuth = useSelector(authSelectors.selectAuthenticatedUserObject);
  const mtableLocalization = useMaterialTableLocalization();
  // selectors
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [entityData, setEntityData] = useState(null);
  const [entityMetaData, setEntityMetaData] = useState(null);

  const [openReviewKYCDialog, setOpenReviewKYCDialog] = useState(false);
  const [openEditGroupTypesFormDialog, setOpenEditGroupTypesFormDialog] = useState(false);
  const [openSetParentEntityFormDialog, setOpenSetParentEntityFormDialog] = useState(false);
  const [deactivateEntityModalOpen, setDeactivateEntityModalOpen] = useState(false);
  const [reactivateEntityModalOpen, setReactivateEntityModalOpen] = useState(false);
  const [openEditEntityCustodySettingsDialog, setOpenEditEntityCustodySettingsDialog] =
    useState(false);

  const isMFAsetup = userAuth?.MFAEnabled;
  const isAdmin = ["EMRGO_SERVICES"].includes(currentEntityGroup.entityType);
  const isKYCRequested = selectedRow?.kyc.kycRequestedDate !== null;
  const isKYCComplete =
    selectedRow?.kyc.status === "Verified" || selectedRow?.kyc.status === "Rejected";
  const ENTITIES_OPTIONS = entitiesList.map((entity) => ({
    label: entity.corporateEntityName,
    value: entity.id,
  }));
  const isEntityActive = selectedRow?.isActive;

  if (isFetching) {
    return <LoadingPage />;
  }

  const handleViewEntityClassification = () => {
    const entityId = selectedRow?.id;
    if (isKYCRequested) {
      navigate(
        reverse(
          `${routes.dashboard.administration.entityDetails.kyc.entities.entity.classification}`,
          { entityId }
        )
      );
    } else {
      navigate(
        reverse(
          `${routes.dashboard.administration.entityDetails.kyc.entities.entity.entityClassification}`,
          { entityId }
        )
      );
    }
  };

  const handleEditGroupTypesOpen = () => {
    setOpenEditGroupTypesFormDialog(true);
  };

  const handleSetParentEntityOpen = () => {
    setOpenSetParentEntityFormDialog(true);
  };

  const handleReviewKYCOpen = () => {
    setOpenReviewKYCDialog(true);
  };

  const handleViewKYCOpen = () => {
    const entityId = selectedRow?.id;
    navigate(
      reverse(
        `${routes.dashboard.administration.entityDetails.kyc.entities.entity.classification}`,
        { entityId }
      )
    );
  };

  const handleViewDocumentsOpen = () => {
    const entityId = selectedRow?.id;
    navigate(
      reverse(`${routes.dashboard.administration.entityDetails.kyc.entities.entity.documents}`, {
        entityId,
      })
    );
  };

  const approveEntityKYC = (payload) => dispatch(kycActionCreators.doApproveKYC(payload));

  const acceptEntityKYC = () => {
    if (selectedRow?.onboardingRequest) {
      setEntityData(selectedRow.onboardingRequest || {});
      setEntityMetaData({ id: selectedRow.id, type: "entity", action: "accept" });
      setModalOpen(true);
    } else {
      approveEntityKYC({
        params: { currentGroupId: currentEntityGroup.id },
        data: { id: selectedRow.id, type: "entity", action: "accept" },
      });
    }
  };

  const handleAssignModalClose = () => {
    setModalOpen(false);
    setEntityMetaData(null);
    setEntityData(null);
  };

  const handleAssignAndApprove = (payloadData) => {
    approveEntityKYC({
      params: { currentGroupId: currentEntityGroup.id },
      data: { ...entityMetaData, ...payloadData },
    });
    handleAssignModalClose();
  };

  const declineEntityKYC = () => {
    approveEntityKYC({
      params: { currentGroupId: currentEntityGroup.id },
      data: { id: selectedRow.id, type: "entity", action: "decline" },
    });
  };

  const handleReactivateEntityOpen = () => {
    setReactivateEntityModalOpen(true);
  };

  const handleDeactivateEntityOpen = () => {
    setDeactivateEntityModalOpen(true);
  };

  const reactivateEntity = (payloadData) => {
    dispatch(entitiesActionCreators.doReactivateEntity(payloadData));
    setReactivateEntityModalOpen(false);
  };

  const deactivateEntity = (payloadData) => {
    dispatch(entitiesActionCreators.doDeactivateEntity(payloadData));
    setDeactivateEntityModalOpen(false);
  };

  const handleManageGroupsClick = () => {
    const entityId = selectedRow?.id;
    navigate(
      reverse(
        `${routes.dashboard.administration.entityManagement.entities.entity.entityGroups.home}`,
        { entityId }
      )
    );
  };

  const handleManageUsersClick = () => {
    const entityId = selectedRow?.id;
    navigate(
      reverse(
        `${routes.dashboard.administration.entityManagement.entities.entity.entityUsers.home}`,
        { entityId }
      )
    );
  };

  const handleEditPreferencesClick = () => {
    const entityId = selectedRow?.id;
    navigate(
      reverse(
        `${routes.dashboard.administration.entityManagement.entities.entity.editEntityPrefs.home}`,
        { entityId }
      )
    );
  };

  const handleEditCustodySettingsOpen = () => {
    setOpenEditEntityCustodySettingsDialog(true);
  };

  const actions = [
    {
      callback: handleManageGroupsClick,
      icon: <GroupWorkIcon fontSize="small" />,
      label: t(
        "administration:EntityManagement.EntityManagementTable.Buttons.Manage Entity Groups"
      ),
    },
    {
      callback: handleManageUsersClick,
      icon: <SupervisorAccountIcon fontSize="small" />,
      label: t("administration:EntityManagement.EntityManagementTable.Buttons.Manage Entity Users"),
    },
    {
      callback: handleEditPreferencesClick,
      icon: <SettingsIcon fontSize="small" />,
      label: t(
        "administration:EntityManagement.EntityManagementTable.Buttons.Edit Entity Preferences"
      ),
      hidden: isAdmin,
    },
    {
      callback: handleViewEntityClassification,
      icon: <BallotIcon fontSize="small" />,
      label: t("administration:ParentEntity.Entity Users.Actions.Entity Classification"),
      hidden: isAdmin,
    },
    {
      callback: handleEditGroupTypesOpen,
      icon: <DeviceHubIcon fontSize="small" />,
      label: t("administration:ParentEntity.Entity Users.Actions.Edit Group Types"),
      hidden: !isAdmin,
    },
    {
      callback: handleSetParentEntityOpen,
      icon: <AccountTreeIcon fontSize="small" />,
      label: t("administration:ParentEntity.Entity Users.Actions.Set Parent Entity"),
      hidden: !isAdmin,
    },
    {
      callback: handleEditCustodySettingsOpen,
      icon: <AccountBalanceIcon fontSize="small" />,
      label: t("administration:ParentEntity.Entity Users.Actions.Custody Settings"),
      hidden: inProd || !isAdmin,
    },
    {
      callback: acceptEntityKYC,
      icon: <CheckIcon fontSize="small" />,
      label: t("administration:ParentEntity.Entity Users.Actions.Approve KYC"),
      hidden: !isAdmin,
      disabled: isKYCComplete,
    },
    {
      callback: declineEntityKYC,
      icon: <ClearIcon fontSize="small" />,
      label: t("administration:ParentEntity.Entity Users.Actions.Reject KYC"),
      hidden: !isAdmin,
      disabled: isKYCComplete,
    },
    {
      callback: handleReviewKYCOpen,
      icon: <DescriptionIcon fontSize="small" />,
      label: t("administration:ParentEntity.Entity Users.Actions.Review KYC"),
      hidden: !isMFAsetup,
      disabled: !isAdmin && !isKYCRequested,
    },
    {
      callback: handleViewKYCOpen,
      icon: <VisibilityIcon fontSize="small" />,
      label: t("administration:ParentEntity.Entity Users.Actions.View KYC"),
      hidden: !isMFAsetup,
      disabled: !isAdmin && !isKYCRequested,
    },
    {
      callback: handleViewDocumentsOpen,
      icon: <FindInPageIcon fontSize="small" />,
      label: t("administration:ParentEntity.Entity Users.Actions.View Documents"),
      hidden: !isMFAsetup,
      disabled: !isAdmin && !isKYCRequested,
    },
    {
      callback: handleDeactivateEntityOpen,
      icon: <LockIcon fontSize="small" />,
      label: t("administration:ParentEntity.Entity Users.Actions.Deactivate Entity"),
      disabled: !isEntityActive,
      hidden: !isAdmin,
    },
    {
      callback: handleReactivateEntityOpen,
      icon: <LockOpenIcon fontSize="small" />,
      label: t("administration:ParentEntity.Entity Users.Actions.Reactivate Entity"),
      disabled: isEntityActive,
      hidden: !isAdmin,
    },
  ];

  const columns = isAdmin
    ? [
        {
          title: t("administration:ParentEntity.Entity Users.Table.Entity ID"),
          field: "wethaqEntityId",
        },
        {
          title: t("administration:ParentEntity.Entity Users.Table.Entity Name"),
          field: "name",
          defaultSort: "asc",
        },
        {
          title: t("administration:ParentEntity.Entity Users.Table.Parent Entity"),
          field: "parentEntityName",
        },
        {
          title: t("administration:ParentEntity.Entity Users.Table.Entity Preferences"),
          field: "entityPreferences",
          sorting: false,
          render: (rowData) => (
            <Grid container spacing={1}>
              {rowData?.entityPreferences.map((i) => (
                <Grid item key={i?.id}>
                  <Chip
                    size="small"
                    key={i?.id}
                    label={capitalCase(i?.displayName)}
                    color="primary"
                  />
                </Grid>
              ))}
            </Grid>
          ),
        },
        {
          title: `${t(
            "administration:EntityManagement.EntityManagementTable.Headers.ValidGroupType"
          )}`,
          field: "validGroupTypes",
          sorting: false,
          render: (rowData) => (
            <Grid container spacing={1}>
              {rowData?.validGroupTypes.map((i) => (
                <Grid item key={i.id}>
                  <Chip size="small" key={i.id} label={capitalCase(i.entityType)} color="primary" />
                </Grid>
              ))}
            </Grid>
          ),
        },
        {
          title: "Has Custody Settings?",
          field: "hasSecuritySettings",
          render: (rowData) => (rowData?.hasSecuritySettings ? "Yes" : "No"),
        },
      ]
    : [
        {
          title: t("administration:ParentEntity.Entity Users.Table.Entity ID"),
          field: "wethaqEntityId",
        },
        {
          title: t("administration:ParentEntity.Entity Users.Table.Entity"),
          field: "name",
        },
        {
          title: t("administration:ParentEntity.Entity Users.Table.Entity Type"),
          field: "name",
          // render: (rowData) => rowData?.validGroupTypes[0]?.entityType,
          render: (rowData) =>
            rowData?.validGroupTypes[0]?.entityType === "FIDUCIARY"
              ? capitalCase("SPE Trustee")
              : rowData?.validGroupTypes[0]?.entityType,
        },

        {
          title: t("administration:ParentEntity.Entity Users.Table.Jurisdiction"),
          field: "onboardingRequest?.jurisdiction",
          render: (rowData) => rowData?.onboardingRequest?.jurisdiction,
        },
        {
          title: t("administration:ParentEntity.Entity Users.Table.Relationship Manager"),
          field: "name",
          render: (rowData) =>
            rowData?.onboardingRequest?.relationshipManagers?.map(
              (manager, index) =>
                `${index !== 0 ? "," : ""}${manager?.user?.firstName || ""} ${
                  manager?.user?.middleName || ""
                } ${manager?.user?.lastName || ""}`
            ),
        },
        {
          title: t("administration:ParentEntity.Entity Users.Table.KYC Status"),
          field: "kyc.status",
          render: (rowData) => titleRenderer(rowData?.kyc?.status),
        },
      ];

  return (
    <Fragment>
      <MaterialTable
        size="small"
        title={t("administration:EntityManagement.EntityManagementTable.Entities")}
        columns={columns}
        data={tableData}
        detailPanel={({ rowData }) => (
          <div
            style={{
              padding: "1rem 2rem 4rem 2rem",
              backgroundColor: "white",
            }}
          >
            <div>
              <Typography variant="body1" color="primary">
                {t("administration:EntityManagement.EntityManagementTable.Entity Groups")}
                <Link
                  to={reverse(
                    `${routes.dashboard.administration.entityManagement.entities.entity.entityGroups.home}`,
                    { entityId: rowData.id }
                  )}
                >
                  <Typography className="pl-1" variant="caption">
                    Manage
                  </Typography>
                </Link>
              </Typography>
            </div>
            <Grid container>
              <TableContainer>
                <Table size="small" aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Group Name</TableCell>
                      <TableCell>Group Type</TableCell>
                      <TableCell>Active</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rowData?.groups?.map((row) => (
                      <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell>
                          {row.entityType === "FIDUCIARY"
                            ? "SPE Trustee"
                            : capitalCase(row.entityType)}
                        </TableCell>
                        <TableCell>{row.isActive ? "Yes" : "No"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </div>
        )}
        options={{
          ...tableStyles,
          searchFieldVariant: "outlined",
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
      <EditGroupTypesFormDialog
        entityId={selectedRow?.id}
        initialValues={{
          entityTypes: selectedRow?.validGroupTypes.map((i) => i.entityType),
        }}
        open={openEditGroupTypesFormDialog}
        handleClose={() => {
          setOpenEditGroupTypesFormDialog(false);
          setSelectedRow(null);
        }}
      />
      <SetParentEntityFormDialog
        entityId={selectedRow?.id}
        initialValues={{
          parentEntityId: selectedRow?.entityParentId,
        }}
        open={openSetParentEntityFormDialog}
        handleClose={() => {
          setOpenSetParentEntityFormDialog(false);
          setSelectedRow(null);
        }}
      />
      {!inProd && (
        <EditCustodySettingsFormDialog
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          open={openEditEntityCustodySettingsDialog}
          handleClose={() => {
            setOpenEditEntityCustodySettingsDialog(false);
          }}
        />
      )}
      <AssignEntityModal
        handleClose={handleAssignModalClose}
        entities={ENTITIES_OPTIONS}
        data={entityData}
        isModalOpen={modalOpen}
        submitAssignForm={handleAssignAndApprove}
      />
      <ViewKYCModal
        entityId={selectedRow?.id}
        rowData={selectedRow}
        open={openReviewKYCDialog}
        onClose={() => setOpenReviewKYCDialog(false)}
      />
      <ReactivateEntityModal
        open={reactivateEntityModalOpen}
        onClose={() => setReactivateEntityModalOpen(false)}
        selectedRow={selectedRow}
        reactivateEntity={reactivateEntity}
      />
      <DeactivateEntityModal
        open={deactivateEntityModalOpen}
        onClose={() => setDeactivateEntityModalOpen(false)}
        selectedRow={selectedRow}
        deactivateEntity={deactivateEntity}
      />
    </Fragment>
  );
};

EntitiesTable.propTypes = {
  tableData: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      legalIdentifier: PropTypes.string,
      legalEntityIdentifier: PropTypes.string,
      clientTermsStatus: PropTypes.string,
      tncStatus: PropTypes.number,
      isActive: PropTypes.bool,
      validGroupTypes: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          entityType: PropTypes.string,
        })
      ),
      groups: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          name: PropTypes.string,
          entityType: PropTypes.string,
        })
      ),
      kyc: PropTypes.shape({}),
      onboardingRequest: PropTypes.shape({}),
      entityPreferences: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          displayName: PropTypes.string,
        })
      ),
      parentEntityName: PropTypes.string,
      wethaqEntityId: PropTypes.string,
      agreements: PropTypes.shape({}),
      tableData: PropTypes.shape({}),
    })
  ).isRequired,
};

export default EntitiesTable;
