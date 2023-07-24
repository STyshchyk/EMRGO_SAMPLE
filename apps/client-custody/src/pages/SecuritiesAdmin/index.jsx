import { Fragment, lazy } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

import MinorNavbar from "../../components/MinorNavbar";
import accessControlsList from "../../constants/accessControlsList";
import routes from "../../constants/routes";
import authorizeRouteAccess from "../../helpers/authorizeRouteAccess";
import findTheFirstAccessibleRoutePath from "../../helpers/findTheFirstAccessibleRoutePath";
import * as authSelectors from "../../redux/selectors/auth";

const ExternalSecuritiesList = lazy(() => import("./ExternalSecuritiesList"));

const PageWrapper = ({ children }) => <div style={{ marginTop: "1rem" }}>{children}</div>;

const SecuritiesAdmin = () => {
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);
  const { accessControls } = currentEntityGroup;
  const listOfUserACLs = accessControls?.map((i) => i.key);

  const PILL_ROUTE_CONFIGS = [
    {
      path: routes.dashboard.securitiesAdmin.securitiesList,
      link: routes.dashboard.securitiesAdmin.securitiesList,
      text: "Minor Navigation.Securities Admin.Securities List",
      disabled: false,
    },
  ];

  const nextAccessibleRoutePath = findTheFirstAccessibleRoutePath(PILL_ROUTE_CONFIGS);

  return (
    <Routes>
      <Route exact path="" element={<Navigate to={nextAccessibleRoutePath} />}></Route>

      <Route
        path="securities-list"
        element={
          <Fragment>
            <MinorNavbar routes={PILL_ROUTE_CONFIGS} />

            <PageWrapper>
              <ExternalSecuritiesList />
            </PageWrapper>
          </Fragment>
        }
      ></Route>
    </Routes>
  );
};

export default SecuritiesAdmin;
