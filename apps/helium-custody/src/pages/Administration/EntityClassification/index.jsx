import { Fragment, lazy } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Route, Routes, useParams } from "react-router-dom";

import { reverse } from "named-urls";

import MinorNavigation from "../../../components/MinorNavigation";
import PageTitle from "../../../components/PageTitle";
import accessControlsList from "../../../constants/accessControlsList";
import routes from "../../../constants/routes";
import * as authSelectors from "../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../redux/selectors/entities";

const Classification = lazy(() => import("./Classification"));

const EntityKYCLayout = ({ children }) => {
  const entities = useSelector(entitiesSelectors.selectEntities);
  const { entityId } = useParams();
  const currentlySelectedEntity = entities.find((i) => i.id === entityId);

  return (
    <div
      style={{
        marginTop: "1rem",
      }}
    >
      <PageTitle title={`${currentlySelectedEntity?.corporateEntityName ?? ""}`} />

      {children}
    </div>
  );
};

// const KYCOverviewPage = ({ isComplianceOfficer, isRelationshipManager }) => <Overview />;

const ClassificationPage = ({ isComplianceOfficer, isRelationshipManager }) => (
  <EntityKYCLayout>
    <Classification />
  </EntityKYCLayout>
);

const EntityKYC = () => {
  // const { t } = useTranslation(['kyc']);
  const { entityId } = useParams();

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const { accessControls } = currentEntityGroup;
  // const hasManageKYCAccessControl = currentEntityGroup?.accessControls?.some((acl) => acl?.key === 'KYC/Manage');

  // const currentEntityType = currentEntityGroup?.entityType;
  // const isWethaqAdmin = currentEntityType === 'EMRGO_SERVICES';

  // !DEV NOTE: THIS FLAG IS NOT ACCURATE SINCE ALL WETHAQ ADMINS ARE BASICALLY INDISTINGUISHABLE FROM EACH OTHER IN TERMS OF ACLS/ROLES
  // !DEV NOTE: NEED TO ASK THE BACKEND TEAM TO IMPLEMENT SOME FLAG TO INDICATE WHICH WETHAQ ADMINS IS THE ACTUAL CO
  // const isComplianceOfficer = hasManageKYCAccessControl && isWethaqAdmin;

  const ADMIN_MINOR_NAV_ROUTES = [
    // {
    //   path: routes.dashboard.administration.entityDetails.kyc.entities.entity.overview,
    //   link: reverse(routes.dashboard.administration.entityDetails.kyc.entities.entity.overview, { entityId }),
    //   text: 'Minor Navigation.Administration.KYCEdit.Overview',
    //   acls: [accessControlsList.KYC.edit.key, accessControlsList.KYC.manage.key, accessControlsList.KYC.view.key],
    //   disabled: false,
    // },
    {
      path: routes.dashboard.administration.entityDetails.kyc.entities.entity.entityClassification,
      link: reverse(
        routes.dashboard.administration.entityDetails.kyc.entities.entity.entityClassification,
        { entityId }
      ),
      text: "Minor Navigation.Administration.KYCEdit.Classification",
      acls: [
        accessControlsList.KYC.edit.key,
        accessControlsList.KYC.manage.key,
        accessControlsList.KYC.view.key,
      ],
      disabled: false,
    },
  ];

  return (
    <Routes>
      {/**
          <Route exact path={routes.dashboard.administration.entityDetails.kyc.entities.entity.overview}>
          <MinorNavigation routes={ADMIN_MINOR_NAV_ROUTES} currentAccessList={accessControls} />
          <KYCOverviewPage />
        </Route>
      */}
      <Route
        exact
        path={
          routes.dashboard.administration.entityDetails.kyc.entities.entity.entityClassification
        }
      >
        <MinorNavigation routes={ADMIN_MINOR_NAV_ROUTES} currentAccessList={accessControls} />
        <ClassificationPage />
      </Route>
    </Routes>
  );
};
export default EntityKYC;
