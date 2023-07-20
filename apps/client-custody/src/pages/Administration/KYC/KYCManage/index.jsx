/* eslint-disable react/require-default-props */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import MaterialTable from "@material-table/core";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { titleCase } from "change-case";
import { reverse } from "named-urls";

import AssignEntityModal from "../../../../components/AssignEntityModal";
import routes from "../../../../constants/routes";
import { dateRenderer, titleRenderer } from "../../../../helpers/renderers";
import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import { doFetchUserData } from "../../../../redux/actionCreators/auth";
import { doFetchEntities } from "../../../../redux/actionCreators/entities";
import { doApproveKYC } from "../../../../redux/actionCreators/kyc";
import { selectCurrentEntityGroup, selectUserId } from "../../../../redux/selectors/auth";
import { selectEntities } from "../../../../redux/selectors/entities";
import style from "./style.module.scss";

const DEFAULT_DATE_WIDTH_SIZE = 120;

const PlatformDashboard = () => {
  const { t } = useTranslation(["administration", "translation"]);
  const mtableLocalization = useMaterialTableLocalization();
  const dispatch = useDispatch();
  const history = useNavigate();

  // state
  const [modalOpen, setModalOpen] = useState(false);
  const [entityData, setEntityData] = useState(null);
  const [entityMetaData, setEntityMetaData] = useState(null);

  // dispatchers
  const approveEntityKYC = (payload) => dispatch(doApproveKYC(payload));
  // selectors
  const currentEntityGroup = useSelector(selectCurrentEntityGroup);
  const entitiesList = useSelector(selectEntities);
  const userID = useSelector(selectUserId);

  const ENTITIES_OPTIONS = entitiesList.map((entity) => ({
    label: entity.corporateEntityName,
    value: entity.id,
  }));

  useWethaqAPIParams({
    currentGroupId: currentEntityGroup?.id,
  });

  useEffect(() => {
    const fetchEntities = (payload) => dispatch(doFetchEntities(payload));

    fetchEntities();
  }, [dispatch, userID]);

  useEffect(() => {
    const fetchUserData = (payload) => dispatch(doFetchUserData(payload));

    fetchUserData({ data: { id: userID } });
  }, [dispatch, userID]);

  const sharedColumnProperties = {
    cellStyle: {
      color: "#23389c",
      padding: "1px 4px",
      border: "1px solid #cfd8dc",
    },
    emptyValue: t("administration:KYC.KYCManage.PlatformDashboard.N/A"),
    width: 200,
  };

  const KYC_TABLE_COLUMNS = [
    {
      title: `${t("administration:KYC.KYCManage.PlatformDashboard.Entity Name")}`,
      field: "corporateEntityName",
      ...sharedColumnProperties,
      width: 150,
    },
    {
      title: `${t("administration:KYC.KYCManage.PlatformDashboard.Entity Status")}`,
      field: "kyc.status",
      ...sharedColumnProperties,
      render: (rowData) =>
        `${t(`administration:KYC.KYCManage.EntityKYCStatusEnum.${rowData.kyc.status}`)}`,
      width: 150,
    },
    {
      title: `${t("administration:KYC.KYCManage.PlatformDashboard.Role")}`,
      field: "kyc.status",
      ...sharedColumnProperties,
      render: (rowData) => {
        const { groups } = rowData;
        const group = groups[0];
        return titleCase(group ? `${t(`translation:EntityGroupType.${group.entityType}`)}` : "");
      },
      width: 150,
    },
    {
      title: `${t("administration:KYC.KYCManage.PlatformDashboard.Client Term Status")}`,
      field: "kyc",
      ...sharedColumnProperties,
      render: (rowData) => {
        const { kyc } = rowData;
        const hasUserAcceptedClientTerms = kyc?.declarationOfAuthorisation && kyc?.acceptedTnc;
        const clientTermsStatus = hasUserAcceptedClientTerms ? "completed" : "pending";

        return (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>{`${t(
              `administration:KYC.KYCManage.ClientTermsStatusEnum.${clientTermsStatus}`
            )}`}</Typography>
          </div>
        );
      },
      width: 150,
    },
    {
      title: `${t("administration:KYC.KYCManage.PlatformDashboard.Contact Person Name")}`,
      field: "kyc.pocName",
      render: (rowData) => titleRenderer(rowData.kyc.pocName),
      ...sharedColumnProperties,
    },
    {
      title: `${t("administration:KYC.KYCManage.PlatformDashboard.Contact Person Email")}`,
      field: "kyc.pocEmail",
      ...sharedColumnProperties,
    },
    {
      title: `${t("administration:KYC.KYCManage.PlatformDashboard.Date Modified")}`,
      field: "updatedAt",
      ...sharedColumnProperties,
      width: DEFAULT_DATE_WIDTH_SIZE,
      render: (rowData) => dateRenderer(rowData.updatedAt),
    },
    {
      title: `${t("administration:KYC.KYCManage.PlatformDashboard.Modified By")}`,
      field: "kyc.updatedByDetails.firstName",
      ...sharedColumnProperties,
      render: (rowData) =>
        titleRenderer(
          `${rowData.kyc?.updatedByDetails?.firstName} ${
            rowData.kyc?.updatedByDetails?.middleName || ""
          } ${rowData.kyc?.updatedByDetails?.lastName}`
        ),
    },
    {
      title: `${t("administration:KYC.KYCManage.PlatformDashboard.Date Added")}`,
      field: "createdAt",
      ...sharedColumnProperties,
      width: DEFAULT_DATE_WIDTH_SIZE,
      render: (rowData) => dateRenderer(rowData.createdAt),
    },
    {
      title: `${t("administration:KYC.KYCManage.PlatformDashboard.Added By")}`,
      field: "userAddedByDetails.firstName",
      ...sharedColumnProperties,
      render: (rowData) =>
        titleRenderer(
          `${rowData.userAddedByDetails.firstName} ${rowData.userAddedByDetails.middleName || ""} ${
            rowData.userAddedByDetails.lastName
          }`
        ),
    },
    {
      title: `${t("administration:KYC.KYCManage.PlatformDashboard.T&C Status")}`,
      field: "tncStatus",
      ...sharedColumnProperties,
      render: (rowData) => (rowData.tncStatus ? "Accepted" : "Pending"),
    },
  ];

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

  return (
    <div className={style.container}>
      <Box p={2} mt={2} className={style.table__wrapper}>
        <MaterialTable
          size="small"
          title={t("administration:KYC.KYCManage.PlatformDashboard.Entities")}
          columns={KYC_TABLE_COLUMNS}
          data={entitiesList}
          options={{
            tableLayout: "fixed",
            headerStyle: {
              color: "#23389c",
              padding: "2px 2px",
              fontWeight: "700",
              border: "1px solid #cfd8dc",
            },
            rowStyle: {
              color: "#23389c",
              padding: "2px 2px",
            },
            searchFieldVariant: "filled",
            pageSize: 10,
            fixedColumns: {
              left: 1,
            },
          }}
          actions={[
            (rowData) => ({
              icon: "check",
              tooltip: t("administration:KYC.KYCManage.PlatformDashboard.Approve Entity KYC"),
              onClick: () => {
                if (rowData.onboardingRequest) {
                  setEntityData(rowData.onboardingRequest || {});
                  setEntityMetaData({ id: rowData.id, type: "entity", action: "accept" });
                  setModalOpen(true);
                } else {
                  approveEntityKYC({
                    params: { currentGroupId: currentEntityGroup.id },
                    data: { id: rowData.id, type: "entity", action: "accept" },
                  });
                }
              },
              disabled: rowData.kyc.status === "Verified" || rowData.kyc.status === "Rejected",
            }),
            (rowData) => ({
              icon: "close",
              tooltip: t("administration:KYC.KYCManage.PlatformDashboard.Reject Entity KYC"),
              onClick: () => {
                approveEntityKYC({
                  params: { currentGroupId: currentEntityGroup.id },
                  data: { id: rowData.id, type: "entity", action: "decline" },
                });
              },
              disabled: rowData.kyc.status === "Verified" || rowData.kyc.status === "Rejected",
            }),
            (rowData) => ({
              icon: "open_in_new",
              tooltip: t("administration:KYC.KYCManage.PlatformDashboard.View KYC"),
              onClick: () => {
                history.push(
                  reverse(
                    `${routes.dashboard.administration.entityDetails.kyc.entities.entity.classification}`,
                    { entityId: rowData.id }
                  )
                );
              },
            }),
          ]}
          localization={mtableLocalization}
        />
      </Box>
      <AssignEntityModal
        handleClose={handleAssignModalClose}
        entities={ENTITIES_OPTIONS}
        data={entityData}
        isModalOpen={modalOpen}
        submitAssignForm={handleAssignAndApprove}
      />
    </div>
  );
};

// !TO BE DEPRECIATED
const KYCManage = () => {
  // selectors
  const currentEntityGroup = useSelector(selectCurrentEntityGroup);

  useWethaqAPIParams({
    currentGroupId: currentEntityGroup?.id,
  });

  return <PlatformDashboard />;
};

export default KYCManage;
