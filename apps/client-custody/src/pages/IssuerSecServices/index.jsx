import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Navigate, Route, Switch } from "react-router-dom";

import MinorNavbar from "../../components/MinorNavbar";
import accessControlsList from "../../constants/accessControlsList";
import routes from "../../constants/routes";
import authorizeRouteAccess from "../../helpers/authorizeRouteAccess";
import findTheFirstAccessibleRoutePath from "../../helpers/findTheFirstAccessibleRoutePath";
import * as authSelectors from "../../redux/selectors/auth";

const CustodyAndSettlement = lazy(() => import("./CustodyAndSettlement"));
const SecuritiesRegistration = lazy(() => import("./SecuritiesRegistration"));
const AgencyServices = lazy(() => import("./AgencyServices"));
const Registrar = lazy(() => import("./Registrar"));

const PageWrapper = ({ children }) => <div style={{ marginTop: "1rem" }}>{children}</div>;

const IssuerServices = () => {
  const { t } = useTranslation(["issuerServices"]);
  const currentListOfAcls = useSelector(authSelectors.selectCurrentListOfAcls);

  const PILL_ROUTE_CONFIGS = [
    {
      path: routes.dashboard.issuerSecServices.securitiesRegistration,
      link: routes.dashboard.issuerSecServices.securitiesRegistration,
      text: "Minor Navigation.Issuer Services.Securities Registration",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.SECURITIES_SERVICES_ISSUER.view.key,
      ]),
    },
    {
      path: routes.dashboard.issuerSecServices.custodyAndSettlement,
      link: routes.dashboard.issuerSecServices.custodyAndSettlement,
      text: "Minor Navigation.Issuer Services.Custody & Settlement",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.SECURITIES_CUSTODY_AND_CLEARING.view.key,
      ]),
    },
    {
      path: routes.dashboard.issuerSecServices.agencyServices,
      link: routes.dashboard.issuerSecServices.agencyServices,
      text: "Minor Navigation.Securities Services.Payment Administration",
      acls: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.SECURITIES_SERVICES_ISSUER.view.key,
      ]),
    },
    {
      path: routes.dashboard.issuerSecServices.registrar,
      link: routes.dashboard.issuerSecServices.registrar,
      text: "Minor Navigation.Issuer Services.Registrar",
      acls: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.SECURITIES_SERVICES_ISSUER.view.key,
      ]),
    },
  ];

  const nextAccessibleRoutePath = findTheFirstAccessibleRoutePath(PILL_ROUTE_CONFIGS);

  return (
    <Switch>
      <Route exact path={routes.dashboard.issuerSecServices.home}>
        <Navigate to={nextAccessibleRoutePath} />
      </Route>

      <Route path={routes.dashboard.issuerSecServices.securitiesRegistration}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <SecuritiesRegistration />
        </PageWrapper>
      </Route>

      <Route path={routes.dashboard.issuerSecServices.custodyAndSettlement}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <CustodyAndSettlement />
        </PageWrapper>
      </Route>
      <Route path={routes.dashboard.issuerSecServices.agencyServices}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <AgencyServices />
        </PageWrapper>
      </Route>
      <Route path={routes.dashboard.issuerSecServices.registrar}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <Registrar />
        </PageWrapper>
      </Route>
    </Switch>
  );
};

export default IssuerServices;
