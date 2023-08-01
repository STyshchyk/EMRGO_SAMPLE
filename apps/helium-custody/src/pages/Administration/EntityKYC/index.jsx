import { Fragment, lazy } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Route, Routes, useParams } from "react-router-dom";

import { reverse } from "named-urls";

import MinorNavigation from "../../../components/MinorNavigation";
import PageTitle from "../../../components/PageTitle";
import accessControlsList from "../../../constants/accessControlsList";
import routes from "../../../constants/routes";
import regionRouteser from "../../../helpers/regions";
import * as authSelectors from "../../../redux/selectors/auth";
import * as entitiesSelectors from "../../../redux/selectors/entities";

const Banking = lazy(() => import("./Banking"));
const Classification = lazy(() => import("./Classification"));
const ClientTerms = lazy(() => import("./ClientTerms"));
const Documents = lazy(() => import("./Documents"));
const EntityWealth = lazy(() => import("./EntityWealth"));
const Experience = lazy(() => import("./Experience"));
const Identification = lazy(() => import("./Identification"));
const KeyIndividuals = lazy(() => import("./KeyIndividuals"));
const IndividualKYC = lazy(() => import("../IndividualKYC"));
// const Overview = lazy(() => import('./Overview'));
const Shareholders = lazy(() => import("./Shareholders"));

/*
  const entities = useSelector(entitiesSelectors.selectEntities);
  const currentlySelectedEntity = entities.find((i) => i.id === entityId);

*/

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

const ClassificationPage = () => (
  <EntityKYCLayout>
    <Classification />
  </EntityKYCLayout>
);
const IdentificationPage = () => (
  <EntityKYCLayout>
    <Identification />
  </EntityKYCLayout>
);
const BankingPage = () => (
  <EntityKYCLayout>
    <Banking />
  </EntityKYCLayout>
);
const ShareholdersPage = () => (
  <EntityKYCLayout>
    <Shareholders />
  </EntityKYCLayout>
);
const IndividualKYCPage = () => (
  <EntityKYCLayout>
    <IndividualKYC />
  </EntityKYCLayout>
);
const KeyIndividualPage = () => (
  <EntityKYCLayout>
    <KeyIndividuals />
  </EntityKYCLayout>
);
const WealthPage = () => (
  <EntityKYCLayout>
    <EntityWealth />
  </EntityKYCLayout>
);

const ExperiencePage = () => (
  <EntityKYCLayout>
    <Experience />
  </EntityKYCLayout>
);

const DocumentsPage = () => (
  <EntityKYCLayout>
    <Documents />
  </EntityKYCLayout>
);

const ClientTermsPage = () => (
  <EntityKYCLayout>
    <ClientTerms />;
  </EntityKYCLayout>
);

const EntityKYC = () => {
  const { t } = useTranslation(["kyc"]);
  const { entityId } = useParams();

  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const { accessControls } = currentEntityGroup;
  const hasManageKYCAccessControl = currentEntityGroup?.accessControls?.some(
    (acl) => acl?.key === "KYC/Manage"
  );

  const currentEntityType = currentEntityGroup?.entityType;
  const isWethaqAdmin = currentEntityType === "EMRGO_SERVICES";
  const isIssuer = currentEntityGroup?.accessControls.some(
    (acl) => acl?.key === accessControlsList.SECURITIES_SERVICES_ISSUER.view.key
  );

  // !DEV NOTE: THIS FLAG IS NOT ACCURATE SINCE ALL WETHAQ ADMINS ARE BASICALLY INDISTINGUISHABLE FROM EACH OTHER IN TERMS OF ACLS/ROLES
  // !DEV NOTE: NEED TO ASK THE BACKEND TEAM TO IMPLEMENT SOME FLAG TO INDICATE WHICH WETHAQ ADMINS IS THE ACTUAL CO
  const isComplianceOfficer = hasManageKYCAccessControl && isWethaqAdmin;

  const ADMIN_MINOR_NAV_ROUTES = [
    // {
    //   path: routes.dashboard.administration.entityDetails.kyc.entities.entity.overview,
    //   link: reverse(routes.dashboard.administration.entityDetails.kyc.entities.entity.overview, { entityId }),
    //   text: 'Minor Navigation.Administration.KYCEdit.Overview',
    //   acls: [accessControlsList.KYC.edit.key, accessControlsList.KYC.manage.key, accessControlsList.KYC.view.key],
    //   disabled: false,
    // },
    {
      path: routes.dashboard.administration.entityDetails.kyc.entities.entity.classification,
      link: reverse(
        routes.dashboard.administration.entityDetails.kyc.entities.entity.classification,
        { entityId }
      ),
      text: "Minor Navigation.Administration.KYCEdit.Classification",
      acls: [
        accessControlsList.KYC.edit.key,
        accessControlsList.KYC.manage.key,
        accessControlsList.KYC.view.key,
      ],
      disabled: isIssuer,
    },
    {
      path: routes.dashboard.administration.entityDetails.kyc.entities.entity.identification,
      link: reverse(
        routes.dashboard.administration.entityDetails.kyc.entities.entity.identification,
        { entityId }
      ),
      text: "Minor Navigation.Administration.KYCEdit.Identification",
      acls: [
        accessControlsList.KYC.edit.key,
        accessControlsList.KYC.manage.key,
        accessControlsList.KYC.view.key,
      ],
      disabled: false,
    },
    {
      path: routes.dashboard.administration.entityDetails.kyc.entities.entity.banking,
      link: reverse(routes.dashboard.administration.entityDetails.kyc.entities.entity.banking, {
        entityId,
      }),
      text: "Minor Navigation.Administration.KYCEdit.Banking",
      acls: [
        accessControlsList.KYC.edit.key,
        accessControlsList.KYC.manage.key,
        accessControlsList.KYC.view.key,
      ],
      disabled: false,
    },
    {
      path: routes.dashboard.administration.entityDetails.kyc.entities.entity.shareholders,
      link: reverse(
        routes.dashboard.administration.entityDetails.kyc.entities.entity.shareholders,
        { entityId }
      ),
      text: "Minor Navigation.Administration.KYCEdit.Shareholders/UBO",
      acls: [
        accessControlsList.KYC.edit.key,
        accessControlsList.KYC.manage.key,
        accessControlsList.KYC.view.key,
      ],
      disabled: isIssuer,
    },
    {
      path: routes.dashboard.administration.entityDetails.kyc.entities.entity.keyIndividuals,
      link: reverse(
        routes.dashboard.administration.entityDetails.kyc.entities.entity.keyIndividuals,
        { entityId }
      ),
      text: "Minor Navigation.Administration.KYCEdit.Key Individuals",
      acls: [
        accessControlsList.KYC.edit.key,
        accessControlsList.KYC.manage.key,
        accessControlsList.KYC.view.key,
      ],
      disabled: false,
    },
    {
      path: routes.dashboard.administration.entityDetails.kyc.entities.entity.wealth,
      link: reverse(routes.dashboard.administration.entityDetails.kyc.entities.entity.wealth, {
        entityId,
      }),
      text: regionRouteser({
        sa: "Minor Navigation.Administration.KYCEdit.Entity/Individual Wealth",
        ae: "Minor Navigation.Administration.KYCEdit.Entitys Wealth",
      }),
      acls: [
        accessControlsList.KYC.edit.key,
        accessControlsList.KYC.manage.key,
        accessControlsList.KYC.view.key,
      ],
      disabled: isIssuer,
    },
    {
      path: routes.dashboard.administration.entityDetails.kyc.entities.entity.experience,
      link: reverse(routes.dashboard.administration.entityDetails.kyc.entities.entity.experience, {
        entityId,
      }),
      text: "Minor Navigation.Administration.KYCEdit.Experience",
      acls: [
        accessControlsList.KYC.edit.key,
        accessControlsList.KYC.manage.key,
        accessControlsList.KYC.view.key,
      ],
      disabled: isIssuer,
    },
    {
      path: routes.dashboard.administration.entityDetails.kyc.entities.entity.documents,
      link: reverse(routes.dashboard.administration.entityDetails.kyc.entities.entity.documents, {
        entityId,
      }),
      text: "Minor Navigation.Administration.KYCEdit.Documents",
      acls: [
        accessControlsList.KYC.edit.key,
        accessControlsList.KYC.manage.key,
        accessControlsList.KYC.view.key,
      ],
      disabled: false,
    },
    // {
    //   path: routes.dashboard.administration.entityDetails.kyc.entities.entity.clientTerms,
    //   link: reverse(routes.dashboard.administration.entityDetails.kyc.entities.entity.clientTerms, { entityId }),
    //   text: 'Minor Navigation.Administration.KYCEdit.Client Terms',
    //   acls: [accessControlsList.KYC.edit.key, accessControlsList.KYC.manage.key, accessControlsList.KYC.view.key],

    //   // !Dev note: REVIEW THIS CHECK IF ONBOARDING API IS UPDATED TO ACCEPT A NEW ENTITY TYPE OTHER THAN INV/OBL/ISS
    //   disabled: !['INVESTOR', 'OBLIGOR', 'ISSUER', 'VISITOR'].includes(currentEntityType),
    // },
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
        path={routes.dashboard.administration.entityDetails.kyc.entities.entity.classification}
      >
        <MinorNavigation routes={ADMIN_MINOR_NAV_ROUTES} currentAccessList={accessControls} />
        <ClassificationPage />
      </Route>

      <Route
        exact
        path={routes.dashboard.administration.entityDetails.kyc.entities.entity.identification}
      >
        <MinorNavigation routes={ADMIN_MINOR_NAV_ROUTES} currentAccessList={accessControls} />
        <IdentificationPage />
      </Route>

      <Route exact path={routes.dashboard.administration.entityDetails.kyc.entities.entity.banking}>
        <MinorNavigation routes={ADMIN_MINOR_NAV_ROUTES} currentAccessList={accessControls} />
        <BankingPage />
      </Route>

      <Route
        exact
        path={routes.dashboard.administration.entityDetails.kyc.entities.entity.shareholders}
      >
        <MinorNavigation routes={ADMIN_MINOR_NAV_ROUTES} currentAccessList={accessControls} />
        <ShareholdersPage />
      </Route>

      <Route
        exact
        path={routes.dashboard.administration.entityDetails.kyc.entities.entity.keyIndividuals}
      >
        <MinorNavigation routes={ADMIN_MINOR_NAV_ROUTES} currentAccessList={accessControls} />
        <KeyIndividualPage />
      </Route>

      <Route exact path={routes.dashboard.administration.entityDetails.kyc.entities.entity.wealth}>
        <MinorNavigation routes={ADMIN_MINOR_NAV_ROUTES} currentAccessList={accessControls} />
        <WealthPage />
      </Route>

      <Route
        exact
        path={routes.dashboard.administration.entityDetails.kyc.entities.entity.experience}
      >
        <MinorNavigation routes={ADMIN_MINOR_NAV_ROUTES} currentAccessList={accessControls} />
        <ExperiencePage />
      </Route>

      <Route
        exact
        path={routes.dashboard.administration.entityDetails.kyc.entities.entity.documents}
      >
        <MinorNavigation routes={ADMIN_MINOR_NAV_ROUTES} currentAccessList={accessControls} />
        <DocumentsPage />
      </Route>

      {/* <Route exact path={routes.dashboard.administration.entityDetails.kyc.entities.entity.clientTerms}>
          <MinorNavigation routes={ADMIN_MINOR_NAV_ROUTES} currentAccessList={accessControls} />
          <ClientTermsPage />
        </Route> */}

      <Route
        path={
          routes.dashboard.administration.entityDetails.kyc.entities.entity.individuals.individual
            .home
        }
      >
        <IndividualKYCPage />
      </Route>
    </Routes>
  );
};
export default EntityKYC;
