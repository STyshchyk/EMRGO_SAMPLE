import { Fragment, lazy, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import MaterialTable from "@material-table/core";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import SubjectIcon from "@mui/icons-material/Subject";
import { title } from "change-case";
import { reverse } from "named-urls";

import MaterialTableOverflowMenu from "../../../../components/MaterialTableOverflowMenu";
import ViewKYCModal from "../../../../components/ViewKYCModal";
import accessControlsList from "../../../../constants/accessControlsList";
import { tooltipRenderer } from "../../../../constants/paymentAndStatuses/renderers";
// import Button from '../../../../components/Button';
import routes from "../../../../constants/routes";
import regionSwitcher from "../../../../helpers/regions";
import useMaterialTableLocalization from "../../../../hooks/useMTableLocalization";
import useWethaqAPIParams from "../../../../hooks/useWethaqAPIParams";
import * as kycActionCreators from "../../../../redux/actionCreators/kyc";
import * as authSelectors from "../../../../redux/selectors/auth";
import * as kycSelectors from "../../../../redux/selectors/kyc";
import tableStyles from "../../../../styles/cssInJs/materialTable";

const KYCManage = lazy(() => import("../KYCManage"));

const createEntitiesTableData = (entity, t) => {
  const { kyc, onboardingRequest } = entity;
  const hasUserAcceptedClientTerms = kyc?.declarationOfAuthorisation && kyc?.acceptedTnc;
  const kycStatus = t(`KYC.KYCManage.EntityKYCStatusEnum.${kyc?.status}`);
  const entityUserType = t(`KYC.KYCManage.EntityUserType.${onboardingRequest?.entityUserType}`);

  return {
    id: entity.id,
    corporateEntityName: entity.corporateEntityName,
    entityUserType: title(entityUserType),
    jurisdiction: onboardingRequest?.jurisdiction,
    relationshipManager: entity.relationshipManager,
    kycStatus: title(kycStatus),
    clientTermsStatus: hasUserAcceptedClientTerms ? "completed" : "pending",
    amlCheck: entity.amlCheck,
  };
};

const KYCEntitiesList = () => {
  const { t } = useTranslation(["administration"]);
  const history = useNavigate();
  const dispatch = useDispatch();
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const kycData = useSelector(kycSelectors.selectKYCData);
  const userObject = useSelector(authSelectors.selectAuthenticatedUserObject);
  const individualId = userObject?.id;
  const isMFAEnabled = userObject?.MFAEnabled;
  const entityId = userObject?.entityGroups[0]?.entity?.id;
  const currentEntityGroupID = currentEntityGroup?.id;
  const isIssuer = currentEntityGroup?.accessControls.some(
    (acl) => acl?.key === accessControlsList.SECURITIES_SERVICES_ISSUER.view.key
  );
  const isClassificationComplete = kycData?.entityType?.length !== 0;
  const mtableLocalization = useMaterialTableLocalization();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openViewKYCDialog, setViewKYCDialog] = useState(false);

  // * FIXME - MOVE THOSE TO AUTH/SELECTORS
  const hasManageKYCAccessControl = currentEntityGroup?.accessControls.some(
    (acl) => acl?.key === "KYC/Manage"
  );
  const hasEditKYCAccessControl = currentEntityGroup?.accessControls.some(
    (acl) => acl?.key === "KYC/Edit"
  );
  const isAdmin = currentEntityGroup?.entityType === "EMRGO_SERVICES";

  const handleIndividualKYCClick = () => {
    // const redirectURL = `${appConfig.baseAPIURL}absher/validate`;
    // window.location.href = redirectURL;
    history.push(
      reverse(
        `${routes.dashboard.administration.entityDetails.kyc.entities.entity.individuals.individual.home}`,
        { entityId: selectedRow.id, individualId }
      )
    );
  };

  const handleEntityClassificationClick = () => {
    history.push(
      reverse(
        `${routes.dashboard.administration.entityDetails.kyc.entities.entity.entityClassification}`,
        { entityId: selectedRow.id }
      )
    );
  };

  const handleEntityKYCClick = () => {
    if (isIssuer) {
      history.push(
        reverse(
          `${routes.dashboard.administration.entityDetails.kyc.entities.entity.identification}`,
          { entityId: selectedRow.id }
        )
      );
    } else {
      history.push(
        reverse(
          `${routes.dashboard.administration.entityDetails.kyc.entities.entity.classification}`,
          { entityId: selectedRow.id }
        )
      );
    }
  };

  const handleViewDocumentsClick = () => {
    history.push(
      reverse(`${routes.dashboard.administration.entityDetails.kyc.entities.entity.documents}`, {
        entityId: selectedRow.id,
      })
    );
  };

  const handleReviewKYCClick = () => {
    setViewKYCDialog(true);
  };

  useWethaqAPIParams({
    currentGroupId: currentEntityGroupID,
  });

  useEffect(() => {
    dispatch(
      kycActionCreators.doFetchKYCData({
        entityId,
        requestPayload: {
          keys: ["entityType"],
          sectionChanges: "classification",
        },
      })
    );
  }, [entityId, dispatch]);

  const actions = [
    {
      callback: handleIndividualKYCClick,
      icon: <AccountCircleIcon fontSize="small" />,
      label: t("KYC.KYCEntitiesList.Context Menu.User KYC"),
      disabled: isMFAEnabled,
    },
    {
      callback: handleEntityClassificationClick,
      icon: <AccountTreeIcon fontSize="small" />,
      label: regionSwitcher({
        sa: t("KYC.KYCEntitiesList.Context Menu.Entity/Individual Classification"),
        ae: t("KYC.KYCEntitiesList.Context Menu.Entity Classification"),
      }),
      disabled: !isMFAEnabled || isClassificationComplete,
    },
    {
      callback: handleReviewKYCClick,
      icon: <SubjectIcon fontSize="small" />,
      label: t("KYC.KYCEntitiesList.Context Menu.Review Entity KYC"),
      disabled: !isMFAEnabled || !isClassificationComplete,
    },
    {
      callback: handleEntityKYCClick,
      icon: <EditIcon fontSize="small" />,
      label: t("KYC.KYCEntitiesList.Context Menu.Entity KYC"),
      disabled: !isMFAEnabled || !isClassificationComplete,
    },
    {
      callback: handleViewDocumentsClick,
      icon: <DescriptionIcon fontSize="small" />,
      label: t("KYC.KYCEntitiesList.Context Menu.View Documents"),
      disabled: !isMFAEnabled || !isClassificationComplete,
    },
  ];

  const headCells = [
    {
      title: t("administration:KYC.KYCEntitiesList.Entity ID"),
      field: "id",
      width: 120,
      render: (rowData) => tooltipRenderer(rowData?.id, rowData?.id),
    },
    {
      title: t("administration:KYC.KYCEntitiesList.Entity"),
      field: "corporateEntityName",
      width: 150,
      render: (rowData) =>
        tooltipRenderer(rowData?.corporateEntityName, rowData?.corporateEntityName),
    },
    {
      title: t("administration:KYC.KYCEntitiesList.Entity Type"),
      field: "entityUserType",
      width: 100,
    },
    {
      title: t("administration:KYC.KYCEntitiesList.Jurisdiction"),
      field: "jurisdiction",
      width: 120,
    },
    {
      title: t("administration:KYC.KYCEntitiesList.Relationship Manager"),
      field: "relationshipManager",
      width: 100,
    },

    {
      title: t("administration:KYC.KYCEntitiesList.KYC Status"),
      field: "kycStatus",
      width: 100,
    },
    {
      title: t("administration:KYC.KYCEntitiesList.Client Terms Status"),
      field: "clientTermsStatus",
      width: 150,
      render: (rowData) => (
        <div>
          {`${t(
            `administration:KYC.KYCManage.ClientTermsStatusEnum.${rowData.clientTermsStatus}`
          )}`}{" "}
        </div>
      ),
    },
    {
      title: t("administration:KYC.KYCEntitiesList.AML Check"),
      field: "amlCheck",
      width: 100,
    },
  ];

  if (hasEditKYCAccessControl && !isAdmin) {
    const entities = [];

    // !DEV NOTE: LIST OF ENTITIES IS BASED ON LOGGED-IN USER'S OWN CURRENT ENTITY GROUP
    // TODO: GET A LIST OF FETCHED ENTITIES FROM REDUX STORE INSTEAD

    entities.push({ ...currentEntityGroup?.entity });

    return (
      <Fragment>
        <MaterialTable
          size="small"
          title=""
          columns={headCells}
          data={entities.map((entity) => createEntitiesTableData(entity, t))}
          options={{
            ...tableStyles,
            searchFieldVariant: "filled",
            pageSize: 5,
            actionsColumnIndex: -1,
            tableLayout: "fixed",
            toolbar: false,
            paging: false,
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
        <ViewKYCModal
          entityId={selectedRow?.id}
          rowData={selectedRow}
          open={openViewKYCDialog}
          onClose={() => {
            setViewKYCDialog(false);
          }}
        />
      </Fragment>
    );
  }

  if (hasManageKYCAccessControl && isAdmin) {
    return <KYCManage />;
  }

  return <p>You do not have access to this module!</p>;
};

export default KYCEntitiesList;
