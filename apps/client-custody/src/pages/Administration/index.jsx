import { Fragment, lazy } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

import MinorNavbar from "../../components/MinorNavbar";
import accessControlsList from "../../constants/accessControlsList";
import routes from "../../constants/routes";
import authorizeRouteAccess from "../../helpers/authorizeRouteAccess";
import findTheFirstAccessibleRoutePath from "../../helpers/findTheFirstAccessibleRoutePath";
import * as authSelectors from "../../redux/selectors/auth";

const EntityAccountManagement = lazy(() => import("./EntityAccountManagement"));
const EntityClassification = lazy(() => import("./EntityClassification"));
const EntityKYC = lazy(() => import("./EntityKYC"));
const EntityManagement = lazy(() => import("./EntityManagement"));
const KYC = lazy(() => import("./KYC"));
const ParentEntityManagement = lazy(() => import("./ParentEntityManagement"));
const VisitorManagement = lazy(() => import("./VisitorManagement"));
const UserManagement = lazy(() => import("./UserManagement"));

const PageWrapper = ({ children }) => <div style={{ marginTop: "1rem" }}>{children}</div>;

const Administration = () => {
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const currentListOfAcls = useSelector(authSelectors.selectCurrentListOfAcls);
  const currentEntityType = useSelector(authSelectors.selectCurrentEntityType);

  const requiredEntityDetailsAcls = [
    accessControlsList.KYC.edit.key,
    accessControlsList.KYC.manage.key,
    accessControlsList.KYC.view.key,
  ];
  const requiredEntityManagementAcls = [
    accessControlsList.GROUP_MANAGEMENT.view.key,
    accessControlsList.GROUP_MANAGEMENT.edit.key,
  ];
  const requiredParentEntityManagementAcls = [accessControlsList.KYC.manage.key];
  const requiredEntityAccountManagementAcls = [accessControlsList.ACCOUNT.manage.key];
  const requiredVisitorsAcls = [
    accessControlsList.KYC.manage.key,
    accessControlsList.KYC.view.key,
    accessControlsList.KYC.edit.key,
  ];
  const requiredUsersAcls = [
    accessControlsList.KYC.manage.key,
    accessControlsList.KYC.view.key,
    accessControlsList.KYC.edit.key,
  ];

  if (["ADMINISTRATOR"].includes(currentEntityType)) {
    requiredEntityDetailsAcls.push(accessControlsList.GROUP_MANAGEMENT.view.key);
    requiredVisitorsAcls.push(
      accessControlsList.GROUP_MANAGEMENT.view.key,
      accessControlsList.GROUP_MANAGEMENT.edit.key
    );
    requiredUsersAcls.push(
      accessControlsList.GROUP_MANAGEMENT.view.key,
      accessControlsList.GROUP_MANAGEMENT.edit.key
    );
  }

  if (["EMRGO_SERVICES"].includes(currentEntityType)) {
    requiredEntityDetailsAcls.push(accessControlsList.GROUP_MANAGEMENT.view.key);
    requiredVisitorsAcls.push(
      accessControlsList.GROUP_MANAGEMENT.view.key,
      accessControlsList.GROUP_MANAGEMENT.edit.key,
      accessControlsList.RELATIONSHIP.manage.key,
      accessControlsList.RELATIONSHIP.view.key
    );
    requiredUsersAcls.push(
      accessControlsList.GROUP_MANAGEMENT.view.key,
      accessControlsList.GROUP_MANAGEMENT.edit.key,
      accessControlsList.RELATIONSHIP.manage.key,
      accessControlsList.RELATIONSHIP.view.key
    );
  }

  const PILL_ROUTE_CONFIGS = [
    // {
    //   path: routes.dashboard.administration.entityDetails.kyc.entities.home,
    //   link: routes.dashboard.administration.entityDetails.kyc.entities.home,
    //   text: 'Minor Navigation.Administration.Entity Details',
    //   acls: [accessControlsList.KYC.manage.key],
    //   disabled: !['ARRANGER', 'OBLIGOR', 'INVESTOR', 'ISSUER', 'EMRGO_SERVICES', 'LEGAL_COUNSEL', 'FIDUCIARY', 'VISITOR'].includes(currentEntityGroup.entityType),
    // },

    // {
    //   path: routes.dashboard.administration.entityDetails.kyc.entities.home,
    //   link: routes.dashboard.administration.entityDetails.kyc.entities.home,
    //   text: 'Minor Navigation.Administration.Entity Details',
    //   disabled: !authorizeRouteAccess(currentListOfAcls, requiredEntityDetailsAcls) || ['ADMINISTRATOR', 'BROKER', 'CO_ARRANGER'].includes(currentEntityGroup.entityType),
    // },
    {
      path: routes.dashboard.administration.entityManagement.visitors.home,
      link: routes.dashboard.administration.entityManagement.visitors.home,
      text: "Minor Navigation.Administration.Visitors",
      disabled:
        !authorizeRouteAccess(currentListOfAcls, requiredVisitorsAcls) ||
        !["EMRGO_SERVICES"].includes(currentEntityGroup.entityType),
    },
    {
      path: routes.dashboard.administration.entityManagement.users.home,
      link: routes.dashboard.administration.entityManagement.users.home,
      text: "Minor Navigation.Administration.Users",
      disabled: !authorizeRouteAccess(currentListOfAcls, requiredUsersAcls),
    },
    {
      path: routes.dashboard.administration.entityManagement.entities.home,
      link: routes.dashboard.administration.entityManagement.entities.home,
      text: "Minor Navigation.Administration.Entity",
      disabled: !authorizeRouteAccess(currentListOfAcls, requiredEntityManagementAcls),
    },

    // {
    //   path: routes.dashboard.administration.entityManagement.visitors.home,
    //   link: routes.dashboard.administration.entityManagement.visitors.home,
    //   text: 'Minor Navigation.Administration.Visitors',
    //   acls: [accessControlsList.GROUP_MANAGEMENT.view.key, accessControlsList.GROUP_MANAGEMENT.edit.key],
    //   disabled: !['EMRGO_SERVICES', 'ADMINISTRATOR'].includes(currentEntityGroup.entityType),
    // },
    /*
      DEPRECIATED
    {
      path: routes.dashboard.administration.clientTerms.entities.home,
      link: routes.dashboard.administration.clientTerms.entities.home,
      text: 'Minor Navigation.Administration.Client Terms',
      acls: [accessControlsList.KYC.edit.key, accessControlsList.KYC.manage.key, accessControlsList.KYC.view.key],
      disabled: !['OBLIGOR', 'INVESTOR', 'ISSUER', 'EMRGO_SERVICES'].includes(currentEntityGroup.entityType),
    },
    */

    {
      path: routes.dashboard.administration.parentEntityManagement.home,
      link: routes.dashboard.administration.parentEntityManagement.home,
      text: "Minor Navigation.Administration.Parent Entity",
      disabled:
        !authorizeRouteAccess(currentListOfAcls, requiredParentEntityManagementAcls) ||
        !["EMRGO_SERVICES"].includes(currentEntityGroup.entityType),
    },

    {
      path: routes.dashboard.administration.entityAccountManagement.home,
      link: routes.dashboard.administration.entityAccountManagement.home,
      text: "Minor Navigation.Administration.Entity Account Management",
      disabled:
        !authorizeRouteAccess(currentListOfAcls, requiredEntityAccountManagementAcls) ||
        !["EMRGO_SERVICES"].includes(currentEntityGroup.entityType),
    },
  ];

  const nextAccessibleRoutePath = findTheFirstAccessibleRoutePath(PILL_ROUTE_CONFIGS);

  return (
    <Routes>
      <Route path="/" element={<Navigate replace to={nextAccessibleRoutePath} />} />

      <Route
        path="/entity-details/kyc/enitites/:entityId/entity-classification"
        element={
          <PageWrapper>
            <EntityClassification />
          </PageWrapper>
        }
      />

      <Route
        path={routes.dashboard.administration.entityDetails.kyc.entities.entity.home}
        element={
          <PageWrapper>
            <EntityKYC />
          </PageWrapper>
        }
      />

      <Route
        exact
        path={routes.dashboard.administration.entityDetails.kyc.entities.home}
        element={
          <Fragment>
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />
            <PageWrapper>
              <KYC />
            </PageWrapper>
          </Fragment>
        }
      />

      <Route
        path="/entity-management/entities/"
        element={
          <Fragment>
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />
            <PageWrapper>
              <EntityManagement />
            </PageWrapper>
          </Fragment>
        }
      />

      <Route
        path={routes.dashboard.administration.entityManagement.visitors.home}
        element={
          <Fragment>
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />
            <PageWrapper>
              <VisitorManagement />
            </PageWrapper>
          </Fragment>
        }
      />

      <Route
        path="/entity-management/users/"
        element={
          <Fragment>
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />
            <PageWrapper>
              <UserManagement />
            </PageWrapper>
          </Fragment>
        }
      />

      <Route
        path={routes.dashboard.administration.parentEntityManagement.home}
        element={
          <Fragment>
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />
            <PageWrapper>
              <ParentEntityManagement />
            </PageWrapper>
          </Fragment>
        }
      />

      <Route
        path={routes.dashboard.administration.entityAccountManagement.home}
        element={
          <Fragment>
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />
            <PageWrapper>
              <EntityAccountManagement />
            </PageWrapper>
          </Fragment>
        }
      />
    </Routes>
  );
};

export default Administration;
