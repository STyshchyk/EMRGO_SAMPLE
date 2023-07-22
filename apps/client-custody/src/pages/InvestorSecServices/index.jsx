import { lazy } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

import MinorNavbar from "../../components/MinorNavbar";
import accessControlsList from "../../constants/accessControlsList";
import featureFlags from "../../constants/featureFlags";
import routes from "../../constants/routes";
import { useFeatureToggle } from "../../context/feature-toggle-context";
import authorizeRouteAccess from "../../helpers/authorizeRouteAccess";
import findTheFirstAccessibleRoutePath from "../../helpers/findTheFirstAccessibleRoutePath";
import * as authSelectors from "../../redux/selectors/auth";

const CustodyAndSettlement = lazy(() => import("./CustodyAndSettlement"));
const Holdings = lazy(() => import("./SecurityHoldings"));
const CounterpartyList = lazy(() => import("../SettlementAdmin/CounterpartyList"));
const CounterpartySSIList = lazy(() => import("../SettlementAdmin/CounterpartySSIList"));
const CorporateActionEvents = lazy(() => import("./CorporateActionEvents"));

// const TrusteeServices = lazy(() => import('./TrusteeServices'));

const PageWrapper = ({ children }) => <div style={{ marginTop: "1rem" }}>{children}</div>;

const InvestorServices = () => {
  const currentListOfAcls = useSelector(authSelectors.selectCurrentListOfAcls);

  const { checkFeatureFlag } = useFeatureToggle();
  const isIntlSecTradeSettlementWorkflowEnabled = checkFeatureFlag(
    featureFlags.intlSecTradeSettlementWorkflow
  );

  const PILL_ROUTE_CONFIGS = [
    {
      path: routes.dashboard.investorSecServices.custodyAndSettlement,
      link: routes.dashboard.investorSecServices.custodyAndSettlement,
      text: "Minor Navigation.Investor Services.Custody & Settlement",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.SECURITIES_CUSTODY_AND_CLEARING.view.key,
      ]),
    },
    {
      path: routes.dashboard.investorSecServices.corporateActionEvents,
      link: routes.dashboard.investorSecServices.corporateActionEvents,
      text: "Corporate Action Diary",
    },
    {
      path: routes.dashboard.investorSecServices.holdings,
      link: routes.dashboard.investorSecServices.holdings,
      text: "Minor Navigation.Investor Services.Holdings",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.SECURITIES_SERVICES_INVESTOR.view.key,
      ]),
    },
    /*
    {
      path: routes.dashboard.investorSecServices.trusteeServices,
      link: routes.dashboard.investorSecServices.trusteeServices,
      text: 'Minor Navigation.Investor Services.Trustee Services',
      acls: [accessControlsList.SECURITIES_SERVICES_INVESTOR.view.key],
    },
    */
    {
      path: routes.dashboard.investorSecServices.counterpartyList,
      link: routes.dashboard.investorSecServices.counterpartyList,
      text: "Minor Navigation.Settlement Admin.Counterparty List",
      disabled:
        !authorizeRouteAccess(currentListOfAcls, [
          accessControlsList.SECURITIES_SERVICES_INVESTOR.view.key,
        ]) || !isIntlSecTradeSettlementWorkflowEnabled,
    },
    {
      path: routes.dashboard.investorSecServices.counterpartySSIList,
      link: routes.dashboard.investorSecServices.counterpartySSIList,
      text: "Minor Navigation.Settlement Admin.Counterparty SSI List",
      disabled:
        !authorizeRouteAccess(currentListOfAcls, [
          accessControlsList.SECURITIES_SERVICES_INVESTOR.view.key,
        ]) || !isIntlSecTradeSettlementWorkflowEnabled,
    },
  ];

  const nextAccessibleRoutePath = findTheFirstAccessibleRoutePath(PILL_ROUTE_CONFIGS);

  return (
    <Routes>
      <Route exact path={routes.dashboard.investorSecServices.home}>
        <Navigate to={nextAccessibleRoutePath} />
      </Route>

      <Route path={routes.dashboard.investorSecServices.custodyAndSettlement}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <CustodyAndSettlement />
        </PageWrapper>
      </Route>

      <Route path={routes.dashboard.investorSecServices.corporateActionEvents}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <CorporateActionEvents />
        </PageWrapper>
      </Route>

      <Route path={routes.dashboard.investorSecServices.holdings}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <Holdings />
        </PageWrapper>
      </Route>
      {/*
      <Route path={routes.dashboard.investorSecServices.trusteeServices}>
        <MinorNavigation routes={PILL_ROUTE_CONFIGS} currentAccessList={accessControls} />

        <PageWrapper>
          <TrusteeServices />
        </PageWrapper>
      </Route>

        */}

      <Route path={routes.dashboard.investorSecServices.counterpartyList}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <CounterpartyList />
        </PageWrapper>
      </Route>

      <Route path={routes.dashboard.investorSecServices.counterpartySSIList}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <CounterpartySSIList />
        </PageWrapper>
      </Route>
    </Routes>
  );
};

export default InvestorServices;
