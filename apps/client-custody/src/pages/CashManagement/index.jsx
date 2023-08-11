import { Fragment, lazy } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

import MinorNavbar from "../../components/MinorNavbar";
import accessControlsList from "../../constants/accessControlsList";
import routes from "../../constants/routes";
import authorizeRouteAccess from "../../helpers/authorizeRouteAccess";
import findTheFirstAccessibleRoutePath from "../../helpers/findTheFirstAccessibleRoutePath";
import * as authSelectors from "../../redux/selectors/auth";
import useIsProduction from "../../utils/useIsProduction";
import { Box } from "@mui/material";

const ManagePaymentAccountsPage = lazy(() => import("./ManagePaymentAccountsPage"));
const CashStatementPage = lazy(() => import("./CashStatementPage"));
const AccountTransferPage = lazy(() => import("./AccountTransferPage"));
const PaymentInstructionsPage = lazy(() => import("./PaymentInstructionsPage"));
const IncomingPaymentsPage = lazy(() => import("./IncomingPaymentsPage"));

const BillingAndPayments = () => {
  const currentListOfAcls = useSelector(authSelectors.selectCurrentListOfAcls);
  const inProd = useIsProduction();

  const PILL_ROUTE_CONFIGS = [
    {
      path: routes.dashboard.custody.cashManagement.manageAccounts,
      link: routes.dashboard.custody.cashManagement.manageAccounts,
      text: "Minor Navigation.Cash Management.Accounts",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.ACCOUNT.manage.key,
        accessControlsList.ACCOUNT.edit.key,
        accessControlsList.ACCOUNT.validate.key,
      ]),
    },
    {
      path: routes.dashboard.custody.cashManagement.cashStatement,
      link: routes.dashboard.custody.cashManagement.cashStatement,
      text: "Minor Navigation.Cash Management.Cash Statement",
      // disabled: !['EMRGO_SERVICES', 'INVESTOR', 'ISSUER'].includes(entityType),
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.ACCOUNT.manage.key,
        accessControlsList.ACCOUNT.edit.key,
      ]),
    },
    {
      path: routes.dashboard.custody.cashManagement.accountTransfer,
      link: routes.dashboard.custody.cashManagement.accountTransfer,
      text: "Minor Navigation.Cash Management.Internal Transfer",
      // disabled: !['EMRGO_SERVICES'].includes(entityType),
      disabled: !authorizeRouteAccess(currentListOfAcls, [accessControlsList.ACCOUNT.manage.key]),
    },
    {
      path: routes.dashboard.custody.cashManagement.paymentInstructions,
      link: routes.dashboard.custody.cashManagement.paymentInstructions,
      text: "Minor Navigation.Cash Management.External Payments",
      // disabled: !['INVESTOR', 'ISSUER'].includes(entityType),
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.ACCOUNT.manage.key,
        accessControlsList.ACCOUNT.edit.key,
      ]),
    },

  ];

  const nextAccessibleRoutePath = findTheFirstAccessibleRoutePath(PILL_ROUTE_CONFIGS);

  return (
    <Fragment>
      <MinorNavbar routes={PILL_ROUTE_CONFIGS} />
      <Box sx={{ py: "2rem", px: "2rem" }}>
        <Routes>
          <Route exact path="/" element={<Navigate to={nextAccessibleRoutePath} />}></Route>

          <Route exact path="/manage-accounts" element={<ManagePaymentAccountsPage />}></Route>
          <Route exact path="/cash-statement" element={<CashStatementPage />}></Route>

          <Route
            exact
            path="/internal-transfer"
            element={
              <Fragment>
                {
                  // !NOTE: This is a temporary solution to disable the internal transfers page from the production environment
                }
                {inProd ? <AccountTransferPage /> : <AccountTransferPage />}
              </Fragment>
            }
          ></Route>
          <Route exact path="/payment-instructions" element={<PaymentInstructionsPage />}></Route>
          {/*
          <Route exact path={routes.dashboard.custody.cashManagement.noAccess}>
            <NoAccessPage />
          </Route>
            */}
        </Routes>
      </Box>
    </Fragment>
  );
};

export default BillingAndPayments;
