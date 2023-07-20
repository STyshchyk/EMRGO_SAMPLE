import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Switch } from "react-router-dom";

import MinorNavbar from "../../components/MinorNavbar";
import accessControlsList from "../../constants/accessControlsList";
import routes from "../../constants/routes";
import authorizeRouteAccess from "../../helpers/authorizeRouteAccess";
import findTheFirstAccessibleRoutePath from "../../helpers/findTheFirstAccessibleRoutePath";
import * as authSelectors from "../../redux/selectors/auth";
import CashBalancesReportPage from "./CashBalancesReportPage";
import CashStatementReportPage from "./CashStatementReportPage";
import NewSecHoldingsReportPage from "./NewSecHoldingsReportPage";
import ReferenceDataReportPage from "./ReferenceDataReportPage";
import SecuritiesTransactionsReportPage from "./SecuritiesTransactionsReportPage";

const Reports = () => {
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);

  const { accessControls } = currentEntityGroup;
  const listOfUserACLs = accessControls?.map((i) => i.key);

  const PILL_ROUTE_CONFIGS = [
    {
      path: routes.dashboard.reports.securities.holdings,
      link: routes.dashboard.reports.securities.holdings,
      text: "Minor Navigation.Reports.Securities Holdings",
      disabled: !authorizeRouteAccess(listOfUserACLs, [accessControlsList.REPORTS.view.key]),
    },
    {
      path: routes.dashboard.reports.securities.transactions,
      link: routes.dashboard.reports.securities.transactions,
      text: "Minor Navigation.Reports.Securities Transactions",
      disabled: !authorizeRouteAccess(listOfUserACLs, [accessControlsList.REPORTS.view.key]),
    },
    {
      path: routes.dashboard.reports.cash.balances,
      link: routes.dashboard.reports.cash.balances,
      text: "Minor Navigation.Reports.Cash Balances",
      disabled: !authorizeRouteAccess(listOfUserACLs, [accessControlsList.REPORTS.view.key]),
    },
    {
      path: routes.dashboard.reports.cash.statement,
      link: routes.dashboard.reports.cash.statement,
      text: "Minor Navigation.Reports.Cash Statement",
      disabled: !authorizeRouteAccess(listOfUserACLs, [accessControlsList.REPORTS.view.key]),
    },
    {
      path: routes.dashboard.reports.securities.referenceData,
      link: routes.dashboard.reports.securities.referenceData,
      text: "Minor Navigation.Reports.Reference Data",
      disabled: !authorizeRouteAccess(listOfUserACLs, [accessControlsList.REPORTS.view.key]),
    },
  ];

  const firstAccessibleRoutePath = findTheFirstAccessibleRoutePath(PILL_ROUTE_CONFIGS);

  return (
    <Fragment>
      <MinorNavbar routes={PILL_ROUTE_CONFIGS} />
      <Fragment>
        <Switch>
          <Route exact path={routes.dashboard.reports.home}>
            <Navigate to={firstAccessibleRoutePath} />
          </Route>

          <Route exact path={routes.dashboard.reports.securities.holdings}>
            <NewSecHoldingsReportPage />
          </Route>
          <Route path={routes.dashboard.reports.securities.transactions}>
            <SecuritiesTransactionsReportPage />
          </Route>
          <Route path={routes.dashboard.reports.cash.balances}>
            <CashBalancesReportPage />
          </Route>
          <Route path={routes.dashboard.reports.cash.statement}>
            <CashStatementReportPage />
          </Route>
          <Route path={routes.dashboard.reports.securities.referenceData}>
            <ReferenceDataReportPage />
          </Route>

          {/*
          <Route exact path={routes.dashboard.cashManagement.noAccess}>
            <NoAccessPage />
          </Route>
            */}
        </Switch>
      </Fragment>
    </Fragment>
  );
};

export default Reports;
