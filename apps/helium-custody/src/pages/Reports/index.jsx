import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

import { Box } from "@mui/material";

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
      path: routes.dashboard.custody.reports.securities.holdings,
      link: routes.dashboard.custody.reports.securities.holdings,
      text: "Minor Navigation.Reports.Securities Holdings",
      disabled: !authorizeRouteAccess(listOfUserACLs, [accessControlsList.REPORTS.view.key]),
    },
    {
      path: routes.dashboard.custody.reports.securities.transactions,
      link: routes.dashboard.custody.reports.securities.transactions,
      text: "Minor Navigation.Reports.Securities Transactions",
      disabled: !authorizeRouteAccess(listOfUserACLs, [accessControlsList.REPORTS.view.key]),
    },
    {
      path: routes.dashboard.custody.reports.cash.balances,
      link: routes.dashboard.custody.reports.cash.balances,
      text: "Minor Navigation.Reports.Cash Balances",
      disabled: !authorizeRouteAccess(listOfUserACLs, [accessControlsList.REPORTS.view.key]),
    },
    {
      path: routes.dashboard.custody.reports.cash.statement,
      link: routes.dashboard.custody.reports.cash.statement,
      text: "Minor Navigation.Reports.Cash Statement",
      disabled: !authorizeRouteAccess(listOfUserACLs, [accessControlsList.REPORTS.view.key]),
    },
    {
      path: routes.dashboard.custody.reports.securities.referenceData,
      link: routes.dashboard.custody.reports.securities.referenceData,
      text: "Minor Navigation.Reports.Reference Data",
      disabled: !authorizeRouteAccess(listOfUserACLs, [accessControlsList.REPORTS.view.key]),
    },
  ];

  const firstAccessibleRoutePath = findTheFirstAccessibleRoutePath(PILL_ROUTE_CONFIGS);

  return (
    <Fragment>
      <MinorNavbar routes={PILL_ROUTE_CONFIGS} />
      <Routes>
        <Route exact path="" element={<Navigate to={firstAccessibleRoutePath} />}></Route>

        <Route exact path="securities/holdings" element={<NewSecHoldingsReportPage />}></Route>
        <Route
          path="securities/transactions"
          element={<SecuritiesTransactionsReportPage />}
        ></Route>
        <Route path="cash/balances" element={<CashBalancesReportPage />}></Route>
        <Route path="cash/statement" element={<CashStatementReportPage />}></Route>
        <Route path="securities/reference-data" element={<ReferenceDataReportPage />}></Route>

        {/*
          <Route exact path={routes.dashboard.custody.cashManagement.noAccess}>
            <NoAccessPage />
          </Route>
            */}
      </Routes>
    </Fragment>
  );
};

export default Reports;
