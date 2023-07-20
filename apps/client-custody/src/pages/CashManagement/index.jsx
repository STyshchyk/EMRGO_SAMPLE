import { Fragment, lazy } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Switch } from "react-router-dom";

import MinorNavbar from "../../components/MinorNavbar";
import accessControlsList from "../../constants/accessControlsList";
import routes from "../../constants/routes";
import authorizeRouteAccess from "../../helpers/authorizeRouteAccess";
import findTheFirstAccessibleRoutePath from "../../helpers/findTheFirstAccessibleRoutePath";
import * as authSelectors from "../../redux/selectors/auth";
import useIsProduction from "../../utils/useIsProduction";

const ManagePaymentAccountsPage = lazy(() => import("./ManagePaymentAccountsPage"));
const CashStatementPage = lazy(() => import("./CashStatementPage"));
const AccountTransferPage = lazy(() => import("./AccountTransferPage"));
const PaymentInstructionsPage = lazy(() => import("./PaymentInstructionsPage"));
const IncomingPaymentsPage = lazy(() => import("./IncomingPaymentsPage"));
const InternalTransfersPage = lazy(() => import("./InternalTransfersPage"));

const BillingAndPayments = () => {
  const currentListOfAcls = useSelector(authSelectors.selectCurrentListOfAcls);
  const inProd = useIsProduction();

  const PILL_ROUTE_CONFIGS = [
    {
      path: routes.dashboard.cashManagement.manageAccounts,
      link: routes.dashboard.cashManagement.manageAccounts,
      text: "Minor Navigation.Cash Management.Accounts",
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.ACCOUNT.manage.key,
        accessControlsList.ACCOUNT.edit.key,
        accessControlsList.ACCOUNT.validate.key,
      ]),
    },
    {
      path: routes.dashboard.cashManagement.cashStatement,
      link: routes.dashboard.cashManagement.cashStatement,
      text: "Minor Navigation.Cash Management.Cash Statement",
      // disabled: !['EMRGO_SERVICES', 'INVESTOR', 'ISSUER'].includes(entityType),
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.ACCOUNT.manage.key,
        accessControlsList.ACCOUNT.edit.key,
      ]),
    },
    {
      path: routes.dashboard.cashManagement.accountTransfer,
      link: routes.dashboard.cashManagement.accountTransfer,
      text: "Minor Navigation.Cash Management.Internal Transfer",
      // disabled: !['EMRGO_SERVICES'].includes(entityType),
      disabled: !authorizeRouteAccess(currentListOfAcls, [accessControlsList.ACCOUNT.manage.key]),
    },
    {
      path: routes.dashboard.cashManagement.paymentInstructions,
      link: routes.dashboard.cashManagement.paymentInstructions,
      text: "Minor Navigation.Cash Management.External Payments",
      // disabled: !['INVESTOR', 'ISSUER'].includes(entityType),
      disabled: !authorizeRouteAccess(currentListOfAcls, [
        accessControlsList.ACCOUNT.manage.key,
        accessControlsList.ACCOUNT.edit.key,
      ]),
    },
    {
      path: routes.dashboard.cashManagement.incomingPayments,
      link: routes.dashboard.cashManagement.incomingPayments,
      text: "Minor Navigation.Cash Management.Incoming Payments",
      // disabled: !['INVESTOR', 'ISSUER'].includes(entityType),
      disabled: !authorizeRouteAccess(currentListOfAcls, [accessControlsList.ACCOUNT.manage.key]),
    },
  ];

  const nextAccessibleRoutePath = findTheFirstAccessibleRoutePath(PILL_ROUTE_CONFIGS);

  return (
    <Fragment>
      <MinorNavbar routes={PILL_ROUTE_CONFIGS} />
      <Switch>
        <Route exact path={routes.dashboard.cashManagement.home}>
          <Navigate to={nextAccessibleRoutePath} />
        </Route>

        <Route exact path={routes.dashboard.cashManagement.manageAccounts}>
          <ManagePaymentAccountsPage />
        </Route>
        <Route exact path={routes.dashboard.cashManagement.cashStatement}>
          <CashStatementPage />
        </Route>

        <Route exact path={routes.dashboard.cashManagement.accountTransfer}>
          {
            // !NOTE: This is a temporary solution to disable the internal transfers page from the production environment
          }
          {inProd ? <AccountTransferPage /> : <InternalTransfersPage />}
        </Route>
        <Route exact path={routes.dashboard.cashManagement.paymentInstructions}>
          <PaymentInstructionsPage />
        </Route>
        <Route exact path={routes.dashboard.cashManagement.incomingPayments}>
          <IncomingPaymentsPage />
        </Route>
        {/*
          <Route exact path={routes.dashboard.cashManagement.noAccess}>
            <NoAccessPage />
          </Route>
            */}
      </Switch>
    </Fragment>
  );
};

export default BillingAndPayments;
