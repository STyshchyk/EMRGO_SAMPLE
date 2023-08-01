import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import MaterialTable from "@material-table/core";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { capitalCase } from "change-case";
import { reverse } from "named-urls";

import LoadingPage from "../../../../components/LoadingPage";
import MaterialTableOverflowMenu from "../../../../components/MaterialTableOverflowMenu";
import PageTitle from "../../../../components/PageTitle";
import routes from "../../../../constants/routes";
import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as entityGroupsActionCreators from "../../../../redux/actionCreators/entityGroups";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../../redux/selectors/entities";
import * as entityGroupsSelectors from "../../../../redux/selectors/entityGroups";
import tableStyles from "../../../../styles/cssInJs/materialTable";
import AcceptAgreementDialog from "../AcceptAgreementDialog";
import AddEntityGroupDialog from "../AddEntityGroupDialog";
import AgreementStatusSection from "../AgreementStatusSection";
import RequestAgreementDialog from "../RequestAgreementDialog";

const EntityGroupManagement = () => {
  const mtableLocalization = useMaterialTableLocalization();
  const { t } = useTranslation(["administration"]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openAddEntityGroupDialog, setOpenAddEntityGroupDialog] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const [openRequestAgreementDialog, setOpenRequestAgreementDialog] = useState(false);
  const [openAcceptAgreementDialog, setOpenAcceptAgreementDialog] = useState(false);
  const [selectedAgreementDoc, setSelectedAgreementDoc] = useState("");
  const [selectedEntityGroupId, setSelectedEntityGroupId] = useState(null);
  const { entityId } = useParams();
  const entityGroups = useSelector(entityGroupsSelectors.selectEntityGroups);
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const isLoading = useSelector(entityGroupsSelectors.selectEntityGroupIsLoading);
  const entities = useSelector(entitiesSelectors.selectEntities);

  const currentlySelectedEntity = entities.find((i) => i.id === entityId);
  const currentEntityGroupID = currentEntityGroup?.id;

  const isClient = ["INVESTOR", "OBLIGOR", "ISSUER"].includes(selectedRow?.entityType);
  const isAdmin = ["EMRGO_SERVICES"].includes(currentEntityGroup.entityType);

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    const fetchEntityGroups = (payload) =>
      dispatch(entityGroupsActionCreators.doFetchEntityGroups(payload));
    fetchEntityGroups({ entityId });
  }, [dispatch, entityId, currentEntityGroupID]);

  if (isLoading) {
    return <LoadingPage />;
  }

  const renderIssuanceChip = (row) => {
    const element = [];
    if (row?.investorClientTermsRequested || row?.obligorIssuerClientTermsRequested) {
      if (row?.investorClientTermsSigned || row?.obligorIssuerClientTermsSigned) {
        element.push(
          <Grid item>
            <Chip
              size="small"
              label={t("administration:EntityManagement.EntityManagementTable.Primary Issuance")}
              color="secondary"
            />
          </Grid>
        );
      } else {
        element.push(
          <Grid item>
            <Chip
              size="small"
              variant="outlined"
              label={t("administration:EntityManagement.EntityManagementTable.Primary Issuance")}
              color="secondary"
            />
          </Grid>
        );
      }
    }
    if (row?.admissionAgreementRequested || row?.custodyAgreementRequested) {
      if (row?.admissionAgreementSigned || row?.custodyAgreementSigned) {
        element.push(
          <Grid item>
            <Chip
              size="small"
              label={t("administration:EntityManagement.EntityManagementTable.Securities Services")}
              color="secondary"
            />
          </Grid>
        );
      } else {
        element.push(
          <Grid item>
            <Chip
              size="small"
              variant="outlined"
              label={t("administration:EntityManagement.EntityManagementTable.Securities Services")}
              color="secondary"
            />
          </Grid>
        );
      }
    }
    return element;
  };

  const headCells = [
    {
      title: t("administration:ParentEntity.Entity Users.Table.Entity Name"),
      field: "name",
      cellStyle: { width: 200 },
    },
    // { title: t('administration:ParentEntity.Entity Users.Table.Entity Type'), field: 'entityType', render: (rowData) => capitalCase(rowData.entityType), cellStyle: { width: 200 } },
    {
      title: t("administration:ParentEntity.Entity Users.Table.Entity Type"),
      field: "entityType",
      render: (rowData) =>
        rowData.entityType === "FIDUCIARY"
          ? capitalCase("SPE Trustee")
          : capitalCase(rowData.entityType),
      cellStyle: { width: 200 },
    },

    {
      title: t("administration:ParentEntity.Entity Users.Table.# of Users"),
      field: "users",
      render: (rowData) => rowData.users?.length,
      cellStyle: { width: 200 },
    },
    {
      title: t("administration:ParentEntity.Entity Users.Table.Agreements"),
      field: "agreements",
      render: (rowData) => {
        const isGroupClient = ["INVESTOR", "OBLIGOR", "ISSUER"].includes(rowData?.entityType);
        return isGroupClient ? (
          <Grid container spacing={1}>
            {renderIssuanceChip(rowData.agreements)}
          </Grid>
        ) : (
          "--"
        );
      },

      cellStyle: { width: 200 },
    },
    {
      title: t("administration:ParentEntity.Entity Users.Table.Active"),
      field: "isActive",
      render: (rowData) => (rowData.isActive ? "Yes" : "No"),
      cellStyle: { width: 200 },
    },
  ];

  const handleManageUserAccessClick = () => {
    navigate(
      reverse(
        `${routes.dashboard.administration.entityManagement.entities.entity.entityGroups.entityGroup.entityUserAccessManagement}`,
        { groupId: selectedRow.id, entityId }
      )
    );
  };

  const handleRequestAgreementOpen = () => {
    setOpenRequestAgreementDialog(true);
  };

  const handleRequestAgreement = (payloadData) => {
    dispatch(entityGroupsActionCreators.doRequestAgreement(payloadData));
    setOpenRequestAgreementDialog(false);
  };

  const handleAcceptAgreementOpen = (agreementType, entityGroupId) => {
    setSelectedAgreementDoc(agreementType);
    setSelectedEntityGroupId(entityGroupId);
    setOpenAcceptAgreementDialog(true);
  };

  const handleAcceptAgreement = (payloadData) => {
    dispatch(entityGroupsActionCreators.doRequestAgreement(payloadData));
    setOpenAcceptAgreementDialog(false);
  };

  const actions = [
    {
      callback: handleManageUserAccessClick,
      icon: <SupervisorAccountIcon fontSize="small" />,
      label: t("administration:ParentEntity.Entity Users.Actions.User Access & Permissions"),
    },
    {
      callback: handleRequestAgreementOpen,
      icon: <DescriptionIcon fontSize="small" />,
      label: t("administration:ParentEntity.Entity Users.Actions.Request Agreement"),
      hidden: !isClient || !isAdmin,
    },
  ];

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={9}>
          <PageTitle title={currentlySelectedEntity?.corporateEntityName} />
        </Grid>
        <Grid item xs={3} container justifyContent="flex-end" alignItems="flex-start">
          <Tooltip
            placement="top"
            title={
              currentlySelectedEntity?.kyc.status !== "Approved"
                ? "You cannot add entity groups till KYC is verified"
                : ""
            }
          >
            <span>
              <Button
                variant="contained"
                color="secondary"
                entities
                startIcon={<AddIcon />}
                onClick={() => {
                  setOpenAddEntityGroupDialog(true);
                }}
                disabled={currentlySelectedEntity?.kyc.status !== "Approved"}
              >
                Add New Entity Group
              </Button>
            </span>
          </Tooltip>
        </Grid>
      </Grid>

      <MaterialTable
        size="small"
        title={t("administration:ParentEntity.Entity Users.Table.Manage Entity Groups")}
        loading={isLoading}
        columns={headCells}
        data={entityGroups}
        options={{
          ...tableStyles,
          searchFieldVariant: "filled",
          pageSize: 10,
          actionsColumnIndex: -1,
          detailPanelColumnAlignment: "left",
          detailPanelType: "multiple",
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
        detailPanel={[
          (rowData) => {
            const isGroupClient = ["INVESTOR", "OBLIGOR", "ISSUER"].includes(rowData?.entityType);

            return {
              icon: "chevron_right",
              disabled: !isGroupClient,
              render: () => (
                <div
                  style={{
                    padding: "1rem 2rem 2rem 2rem",
                    backgroundColor: "white",
                  }}
                >
                  <div>
                    <Typography variant="subtitle1" color="primary" className="bold">
                      {t("administration:EntityManagement.EntityManagementTable.Services Access")}
                    </Typography>
                  </div>
                  <br />
                  <TableContainer>
                    <Table size="small" aria-label="simple table">
                      <TableBody>
                        {rowData?.agreements?.investorClientTermsRequested && (
                          <AgreementStatusSection
                            isAdmin={isAdmin}
                            label={t(
                              "administration:EntityManagement.EntityManagementTable.Primary Issuance"
                            )}
                            sectionSignedSigned={rowData?.agreements?.investorClientTermsSigned}
                            handleAcceptAgreementOpen={() => {
                              handleAcceptAgreementOpen("investorClientTerms", rowData.id);
                            }}
                          />
                        )}
                        {rowData?.agreements?.obligorIssuerClientTermsRequested && (
                          <AgreementStatusSection
                            isAdmin={isAdmin}
                            label={t(
                              "administration:EntityManagement.EntityManagementTable.Primary Issuance"
                            )}
                            sectionSignedSigned={
                              rowData?.agreements?.obligorIssuerClientTermsSigned
                            }
                            handleAcceptAgreementOpen={() => {
                              handleAcceptAgreementOpen("obligorIssuerClientTerms", rowData.id);
                            }}
                          />
                        )}
                        {rowData?.agreements?.custodyAgreementRequested && (
                          <AgreementStatusSection
                            isAdmin={isAdmin}
                            label={t(
                              "administration:EntityManagement.EntityManagementTable.Securities Services"
                            )}
                            sectionSignedSigned={rowData?.agreements?.custodyAgreementSigned}
                            handleAcceptAgreementOpen={() => {
                              handleAcceptAgreementOpen(
                                rowData?.entityType === "INVESTOR"
                                  ? "custodyAgreement_inv"
                                  : "custodyAgreement",
                                rowData.id
                              );
                            }}
                          />
                        )}
                        {rowData?.agreements?.admissionAgreementRequested && (
                          <AgreementStatusSection
                            isAdmin={isAdmin}
                            label={t(
                              "administration:EntityManagement.EntityManagementTable.Securities Services"
                            )}
                            sectionSignedSigned={rowData?.agreements?.admissionAgreementSigned}
                            handleAcceptAgreementOpen={() => {
                              handleAcceptAgreementOpen("admissionAgreement", rowData.id);
                            }}
                          />
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <br />
                </div>
              ),
            };
          },
        ]}
      />
      <MaterialTableOverflowMenu
        actions={actions}
        anchorEl={menuAnchorEl}
        setAnchorEl={setMenuAnchorEl}
        selectedRow={selectedRow}
      />
      <AddEntityGroupDialog
        entityId={entityId}
        open={openAddEntityGroupDialog}
        handleClose={() => setOpenAddEntityGroupDialog(false)}
      />
      <RequestAgreementDialog
        entityId={entityId}
        entityGroupId={selectedRow?.id}
        agreements={selectedRow?.agreements}
        open={openRequestAgreementDialog}
        handleClose={() => setOpenRequestAgreementDialog(false)}
        handleRequestAgreement={handleRequestAgreement}
        entityType={selectedRow?.entityType}
      />
      <AcceptAgreementDialog
        entityId={entityId}
        entityGroupId={selectedEntityGroupId}
        open={openAcceptAgreementDialog}
        handleClose={() => setOpenAcceptAgreementDialog(false)}
        handleAcceptAgreement={handleAcceptAgreement}
        selectedAgreementDoc={selectedAgreementDoc}
      />
    </Fragment>
  );
};

export default EntityGroupManagement;
