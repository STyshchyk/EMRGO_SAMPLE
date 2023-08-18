import { Fragment, lazy } from "react";
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
import CounterpartyList from "../SettlementAdmin/CounterpartyList";
import CounterpartySSIList from "../SettlementAdmin/CounterpartySSIList";
import CorporateActionEvents from "./CorporateActionEvents";
import CustodyAndSettlement from "./CustodyAndSettlement";
import Holdings from "./SecurityHoldings";

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
      path: routes.dashboard.custody.investorSecServices.custodyAndSettlement,
      link: routes.dashboard.custody.investorSecServices.custodyAndSettlement,
      text: "Minor Navigation.Investor Services.Custody & Settlement",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.SECURITIES_CUSTODY_AND_CLEARING.view.key,
      ]),
    },
    {
      path: routes.dashboard.custody.investorSecServices.corporateActionEvents,
      link: routes.dashboard.custody.investorSecServices.corporateActionEvents,
      text: "Corporate Action Diary",
    },
    {
      path: routes.dashboard.custody.investorSecServices.holdings,
      link: routes.dashboard.custody.investorSecServices.holdings,
      text: "Minor Navigation.Investor Services.Holdings",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.SECURITIES_SERVICES_INVESTOR.view.key,
      ]),
    },
    /*
    {
      path: routes.dashboard.custody.investorSecServices.trusteeServices,
      link: routes.dashboard.custody.investorSecServices.trusteeServices,
      text: 'Minor Navigation.Investor Services.Trustee Services',
      acls: [accessControlsList.SECURITIES_SERVICES_INVESTOR.view.key],
    },
    */
    {
      path: routes.dashboard.custody.investorSecServices.counterpartyList,
      link: routes.dashboard.custody.investorSecServices.counterpartyList,
      text: "Minor Navigation.Settlement Admin.Counterparty List",
      disabled:
        !authorizeRouteAccess(currentListOfAcls, [
          accessControlsList.SECURITIES_SERVICES_INVESTOR.view.key,
        ]) || !isIntlSecTradeSettlementWorkflowEnabled,
    },
    {
      path: routes.dashboard.custody.investorSecServices.counterpartySSIList,
      link: routes.dashboard.custody.investorSecServices.counterpartySSIList,
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
      <Route exact path="/" element={<Navigate to={nextAccessibleRoutePath} />}></Route>

      <Route
        path="/custody-and-settlement"
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
        path="/corporate-action-events"
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
        path="/holdings"
        element={
          <Fragment>
            {" "}
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />
            <PageWrapper>
              <Holdings />
            </PageWrapper>
          </Fragment>
        }
      ></Route>
      {/*
      <Route path={routes.dashboard.custody.investorSecServices.trusteeServices}>
        <MinorNavigation routes={PILL_ROUTE_CONFIGS} currentAccessList={accessControls} />

        <PageWrapper>
          <TrusteeServices />
        </PageWrapper>
      </Route>

        */}

      <Route
        path="/counterparty-list"
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
        path="/counterparty-ssi-list"
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

export default InvestorServices;
