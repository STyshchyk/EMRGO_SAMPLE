import { lazy } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

import MinorNavbar from "../../components/MinorNavbar";
import accessControlsList from "../../constants/accessControlsList";
import featureFlags from "../../constants/featureFlags";
import routes from "../../constants/routes";
import { CouponEventsTableFiltersProvider } from "../../context/coupon-events-table-filters-context";
import { useFeatureToggle } from "../../context/feature-toggle-context";
import authorizeRouteAccess from "../../helpers/authorizeRouteAccess";
import findTheFirstAccessibleRoutePath from "../../helpers/findTheFirstAccessibleRoutePath";
import * as authSelectors from "../../redux/selectors/auth";

const AgencyServices = lazy(() => import("./AgencyServices"));
const CounterpartyList = lazy(() => import("../SettlementAdmin/CounterpartyList"));
const CounterpartySSIList = lazy(() => import("../SettlementAdmin/CounterpartySSIList"));
const CouponAdministration = lazy(() => import("./CouponAdministration"));
const CustodyAndSettlement = lazy(() => import("./CustodyAndSettlement"));
const FXTransactionList = lazy(() => import("./FXTransactionList"));
const Registrar = lazy(() => import("./Registrar"));
const SecuritiesRegistration = lazy(() => import("./SecuritiesRegistration"));
const CorporateActionEvents = lazy(() => import("./CorporateActionEvents"));
// const TrusteeServices = lazy(() => import('./TrusteeServices'));

const PageWrapper = ({ children }) => <div style={{ marginTop: "1rem" }}>{children}</div>;

const OperationsSecServices = () => {
  const currentListOfAcls = useSelector(authSelectors.selectCurrentListOfAcls);

  const { checkFeatureFlag } = useFeatureToggle();

  const isIntlSecTradeSettlementWorkflowEnabled = checkFeatureFlag(
    featureFlags.intlSecTradeSettlementWorkflow
  );

  const PILL_ROUTE_CONFIGS = [
    {
      path: routes.dashboard.opsSecServices.securitiesRegistration,
      link: routes.dashboard.opsSecServices.securitiesRegistration,
      text: "Minor Navigation.Issuer Services.Securities Registration",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.SECURITIES_SERVICES_OPS.view.key,
      ]),
    },
    {
      path: routes.dashboard.opsSecServices.custodyAndSettlement,
      link: routes.dashboard.opsSecServices.custodyAndSettlement,
      text: "Minor Navigation.Securities Services.Custody & Settlement",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.SECURITIES_CUSTODY_AND_CLEARING.view.key,
      ]),
    },
    {
      path: routes.dashboard.opsSecServices.corporateActionEvents,
      link: routes.dashboard.opsSecServices.corporateActionEvents,
      text: "Corporate Action Diary",
      // disabled: !authorizeRouteAccess(listOfUserACLs, [accessControlsList.SECURITIES_CUSTODY_AND_CLEARING.view.key]),
    },
    {
      path: routes.dashboard.opsSecServices.couponAdministration,
      link: routes.dashboard.opsSecServices.couponAdministration,
      text: "Coupon Administration",
      // disabled: !authorizeRouteAccess(listOfUserACLs, [accessControlsList.SECURITIES_CUSTODY_AND_CLEARING.view.key]),
    },
    {
      path: routes.dashboard.opsSecServices.agencyServices,
      link: routes.dashboard.opsSecServices.agencyServices,
      text: "Minor Navigation.Securities Services.Payment Administration",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.SECURITIES_CUSTODY_AND_CLEARING.view.key,
      ]),
    },
    {
      path: routes.dashboard.opsSecServices.registrar,
      link: routes.dashboard.opsSecServices.registrar,
      text: "Minor Navigation.Securities Services.Registrar",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.SECURITIES_SERVICES_OPS.view.key,
      ]),
    },
    /*
    {
      path: routes.dashboard.opsSecServices.trusteeServices,
      link: routes.dashboard.opsSecServices.trusteeServices,
      text: 'Minor Navigation.Securities Services.Trustee Services',
      acls: [accessControlsList.SECURITIES_SERVICES_OPS.view.key],
    },

    */
    {
      path: routes.dashboard.opsSecServices.fxTransactionList,
      link: routes.dashboard.opsSecServices.fxTransactionList,
      text: "Minor Navigation.Securities Services.FX Transaction List",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.ENTITIES_LISTING.view.key,
      ]),
    },

    {
      path: routes.dashboard.opsSecServices.counterpartyList,
      link: routes.dashboard.opsSecServices.counterpartyList,
      text: "Minor Navigation.Settlement Admin.Counterparty List",
      disabled:
        !authorizeRouteAccess(currentListOfAcls, [
          accessControlsList.SECURITIES_SERVICES_OPS.view.key,
        ]) || !isIntlSecTradeSettlementWorkflowEnabled,
    },
    {
      path: routes.dashboard.opsSecServices.counterpartySSIList,
      link: routes.dashboard.opsSecServices.counterpartySSIList,
      text: "Minor Navigation.Settlement Admin.Counterparty SSI List",
      disabled:
        !authorizeRouteAccess(currentListOfAcls, [
          accessControlsList.SECURITIES_SERVICES_OPS.view.key,
        ]) || !isIntlSecTradeSettlementWorkflowEnabled,
    },
  ];

  const nextAccessibleRoutePath = findTheFirstAccessibleRoutePath(PILL_ROUTE_CONFIGS);

  return (
    <Routes>
      <Route exact path={routes.dashboard.opsSecServices.home}>
        <Navigate to={nextAccessibleRoutePath} />
      </Route>

      <Route path={routes.dashboard.opsSecServices.securitiesRegistration}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <SecuritiesRegistration />
        </PageWrapper>
      </Route>

      <Route path={routes.dashboard.opsSecServices.custodyAndSettlement}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <CustodyAndSettlement />
        </PageWrapper>
      </Route>

      <Route path={routes.dashboard.opsSecServices.corporateActionEvents}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <CorporateActionEvents />
        </PageWrapper>
      </Route>

      <Route path={routes.dashboard.opsSecServices.couponAdministration}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <CouponEventsTableFiltersProvider>
            <CouponAdministration />
          </CouponEventsTableFiltersProvider>
        </PageWrapper>
      </Route>

      <Route path={routes.dashboard.opsSecServices.agencyServices}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <AgencyServices />
        </PageWrapper>
      </Route>

      <Route path={routes.dashboard.opsSecServices.registrar}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <Registrar />
        </PageWrapper>
      </Route>

      {/*
      <Route path={routes.dashboard.opsSecServices.trusteeServices}>
        <MinorNavigation routes={PILL_ROUTE_CONFIGS} currentAccessList={accessControls} />

        <PageWrapper>
          <TrusteeServices />
        </PageWrapper>
      </Route>
    */}

      <Route path={routes.dashboard.opsSecServices.fxTransactionList}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <FXTransactionList />
        </PageWrapper>
      </Route>

      <Route path={routes.dashboard.opsSecServices.counterpartyList}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <CounterpartyList />
        </PageWrapper>
      </Route>

      <Route path={routes.dashboard.opsSecServices.counterpartySSIList}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <CounterpartySSIList />
        </PageWrapper>
      </Route>
    </Routes>
  );
};

export default OperationsSecServices;
