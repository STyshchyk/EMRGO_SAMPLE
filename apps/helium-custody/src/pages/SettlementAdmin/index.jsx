import { lazy } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

import MinorNavbar from "../../components/MinorNavbar";
import accessControlsList from "../../constants/accessControlsList";
import routes from "../../constants/routes";
import authorizeRouteAccess from "../../helpers/authorizeRouteAccess";
import findTheFirstAccessibleRoutePath from "../../helpers/findTheFirstAccessibleRoutePath";
import * as authSelectors from "../../redux/selectors/auth";

const CounterpartyList = lazy(() => import("./CounterpartyList"));
const CounterpartySSIList = lazy(() => import("./CounterpartySSIList"));

const PageWrapper = ({ children }) => <div style={{ marginTop: "1rem" }}>{children}</div>;

const SettlementAdmin = () => {
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const { accessControls } = currentEntityGroup;
  const listOfUserACLs = accessControls?.map((i) => i.key); // use it to disable the minor navigations if needed

  const PILL_ROUTE_CONFIGS = [
    {
      path: routes.dashboard.settlementAdmin.counterpartyList,
      link: routes.dashboard.settlementAdmin.counterpartyList,
      text: "Minor Navigation.Settlement Admin.Counterparty List",
      disabled: !authorizeRouteAccess(listOfUserACLs, [
        accessControlsList.ENTITIES_LISTING.view.key,
      ]),
    },
    {
      path: routes.dashboard.settlementAdmin.counterpartySSIList,
      link: routes.dashboard.settlementAdmin.counterpartySSIList,
      text: "Minor Navigation.Settlement Admin.Counterparty SSI List",
      disabled: !authorizeRouteAccess(listOfUserACLs, [
        accessControlsList.ENTITIES_LISTING.view.key,
      ]),
    },
  ];

  const nextAccessibleRoutePath = findTheFirstAccessibleRoutePath(PILL_ROUTE_CONFIGS);

  return (
    <Routes>
      <Route exact path={routes.dashboard.settlementAdmin.home}>
        <Navigate to={nextAccessibleRoutePath} />
      </Route>

      <Route path={routes.dashboard.settlementAdmin.counterpartyList}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <CounterpartyList />
        </PageWrapper>
      </Route>

      <Route path={routes.dashboard.settlementAdmin.counterpartySSIList}>
        <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

        <PageWrapper>
          <CounterpartySSIList />
        </PageWrapper>
      </Route>
    </Routes>
  );
};

export default SettlementAdmin;
