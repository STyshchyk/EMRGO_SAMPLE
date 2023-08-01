import { Fragment, lazy } from "react";
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
      path: routes.dashboard.custody.opsSecServices.securitiesRegistration,
      link: routes.dashboard.custody.opsSecServices.securitiesRegistration,
      text: "Minor Navigation.Issuer Services.Securities Registration",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.SECURITIES_SERVICES_OPS.view.key,
      ]),
    },
    {
      path: routes.dashboard.custody.opsSecServices.custodyAndSettlement,
      link: routes.dashboard.custody.opsSecServices.custodyAndSettlement,
      text: "Minor Navigation.Securities Services.Custody & Settlement",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.SECURITIES_CUSTODY_AND_CLEARING.view.key,
      ]),
    },
    {
      path: routes.dashboard.custody.opsSecServices.corporateActionEvents,
      link: routes.dashboard.custody.opsSecServices.corporateActionEvents,
      text: "Corporate Action Diary",
      // disabled: !authorizeRouteAccess(listOfUserACLs, [accessControlsList.SECURITIES_CUSTODY_AND_CLEARING.view.key]),
    },
    {
      path: routes.dashboard.custody.opsSecServices.couponAdministration,
      link: routes.dashboard.custody.opsSecServices.couponAdministration,
      text: "Coupon Administration",
      // disabled: !authorizeRouteAccess(listOfUserACLs, [accessControlsList.SECURITIES_CUSTODY_AND_CLEARING.view.key]),
    },
    {
      path: routes.dashboard.custody.opsSecServices.agencyServices,
      link: routes.dashboard.custody.opsSecServices.agencyServices,
      text: "Minor Navigation.Securities Services.Payment Administration",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.SECURITIES_CUSTODY_AND_CLEARING.view.key,
      ]),
    },
    {
      path: routes.dashboard.custody.opsSecServices.registrar,
      link: routes.dashboard.custody.opsSecServices.registrar,
      text: "Minor Navigation.Securities Services.Registrar",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.SECURITIES_SERVICES_OPS.view.key,
      ]),
    },
    /*
    {
      path: routes.dashboard.custody.opsSecServices.trusteeServices,
      link: routes.dashboard.custody.opsSecServices.trusteeServices,
      text: 'Minor Navigation.Securities Services.Trustee Services',
      acls: [accessControlsList.SECURITIES_SERVICES_OPS.view.key],
    },

    */
    {
      path: routes.dashboard.custody.opsSecServices.fxTransactionList,
      link: routes.dashboard.custody.opsSecServices.fxTransactionList,
      text: "Minor Navigation.Securities Services.FX Transaction List",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.ENTITIES_LISTING.view.key,
      ]),
    },

    {
      path: routes.dashboard.custody.opsSecServices.counterpartyList,
      link: routes.dashboard.custody.opsSecServices.counterpartyList,
      text: "Minor Navigation.Settlement Admin.Counterparty List",
      disabled:
        !authorizeRouteAccess(currentListOfAcls, [
          accessControlsList.SECURITIES_SERVICES_OPS.view.key,
        ]) || !isIntlSecTradeSettlementWorkflowEnabled,
    },
    {
      path: routes.dashboard.custody.opsSecServices.counterpartySSIList,
      link: routes.dashboard.custody.opsSecServices.counterpartySSIList,
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
      <Route exact path="" element={<Navigate to={nextAccessibleRoutePath} />}></Route>

      <Route
        path="securities-registration"
        element={
          <Fragment>
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

            <PageWrapper>
              <SecuritiesRegistration />
            </PageWrapper>
          </Fragment>
        }
      ></Route>

      <Route
        path="custody-and-settlement"
        element={
          <Fragment>
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

            <PageWrapper>
              <CustodyAndSettlement />
            </PageWrapper>
          </Fragment>
        }
      ></Route>

      <Route
        path="corporate-action-events"
        element={
          <Fragment>
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

            <PageWrapper>
              <CorporateActionEvents />
            </PageWrapper>
          </Fragment>
        }
      ></Route>

      <Route
        path="coupon-administration"
        element={
          <Fragment>
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

            <PageWrapper>
              <CouponEventsTableFiltersProvider>
                <CouponAdministration />
              </CouponEventsTableFiltersProvider>
            </PageWrapper>
          </Fragment>
        }
      ></Route>

      <Route
        path="agency-services"
        element={
          <Fragment>
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

            <PageWrapper>
              <AgencyServices />
            </PageWrapper>
          </Fragment>
        }
      ></Route>

      <Route
        path="registrar"
        element={
          <Fragment>
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

            <PageWrapper>
              <Registrar />
            </PageWrapper>
          </Fragment>
        }
      ></Route>

      {/*
      <Route path={routes.dashboard.custody.opsSecServices.trusteeServices}>
        <MinorNavigation routes={PILL_ROUTE_CONFIGS} currentAccessList={accessControls} />

        <PageWrapper>
          <TrusteeServices />
        </PageWrapper>
      </Route>
    */}

      <Route
        path="fx-transaction-list"
        element={
          <Fragment>
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

            <PageWrapper>
              <FXTransactionList />
            </PageWrapper>
          </Fragment>
        }
      ></Route>

      <Route
        path="counterparty-list"
        element={
          <Fragment>
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

            <PageWrapper>
              <CounterpartyList />
            </PageWrapper>
          </Fragment>
        }
      ></Route>

      <Route
        path="counterparty-ssi-list"
        element={
          <Fragment>
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

            <PageWrapper>
              <CounterpartySSIList />
            </PageWrapper>
          </Fragment>
        }
      ></Route>
    </Routes>
  );
};

export default OperationsSecServices;
