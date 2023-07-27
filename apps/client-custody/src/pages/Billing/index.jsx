import { Fragment, lazy } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

import MinorNavbar from "../../components/MinorNavbar";
import routes from "../../constants/routes";
// import accessControlsList from '../../constants/accessControlsList';
import findTheFirstAccessibleRoutePath from "../../helpers/findTheFirstAccessibleRoutePath";
import * as authSelectors from "../../redux/selectors/auth";

// import authorizeRouteAccess from '../../helpers/authorizeRouteAccess';

const ClientRateCardPage = lazy(() => import("./ClientRateCardPage"));
const InvoiceManagementPage = lazy(() => import("./InvoiceManagementPage"));
const InvestorInvoicesPage = lazy(() => import("./InvestorInvoicesPage"));

const Billing = () => {
  // const currentListOfAcls = useSelector(authSelectors.selectCurrentListOfAcls);
  const currentEntityType = useSelector(authSelectors.selectCurrentEntityType);

  const PILL_ROUTE_CONFIGS = [
    {
      path: routes.dashboard.billing.invoices,
      link: routes.dashboard.billing.invoices,
      text: "Minor Navigation.Billing.Invoices",
      disabled: !["INVESTOR"].includes(currentEntityType),
    },
    {
      path: routes.dashboard.billing.manageInvoices,
      link: routes.dashboard.billing.manageInvoices,
      text: "Minor Navigation.Billing.Invoices",
      disabled: !["EMRGO_SERVICES"].includes(currentEntityType),
    },
    {
      path: routes.dashboard.billing.clientRateCard,
      link: routes.dashboard.billing.clientRateCard,
      text: "Minor Navigation.Billing.Client Rate Card",
      disabled: !["EMRGO_SERVICES"].includes(currentEntityType),
    },
  ];

  const nextAccessibleRoutePath = findTheFirstAccessibleRoutePath(PILL_ROUTE_CONFIGS);

  return (
    <Fragment>
      <MinorNavbar routes={PILL_ROUTE_CONFIGS} />
      <Routes>
        <Route exact path={routes.dashboard.billing.home}>
          <Navigate to={nextAccessibleRoutePath} />
        </Route>

        <Route exact path={routes.dashboard.billing.invoices}>
          <InvoiceManagementPage />
        </Route>
        <Route exact path={routes.dashboard.billing.manageInvoices}>
          <InvoiceManagementPage />
        </Route>
        <Route exact path={routes.dashboard.billing.clientRateCard}>
          <ClientRateCardPage />
        </Route>

        {/*
          <Route exact path={routes.dashboard.custody.cashManagement.noAccess}>
            <NoAccessPage />
          </Route>
            */}
      </Routes>
    </Fragment>
  );
};

export default Billing;
