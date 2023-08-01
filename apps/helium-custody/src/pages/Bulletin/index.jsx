import { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

import MinorNavbar from "../../components/MinorNavbar";
import accessControlsList from "../../constants/accessControlsList";
import routes from "../../constants/routes";
import authorizeRouteAccess from "../../helpers/authorizeRouteAccess";
import findTheFirstAccessibleRoutePath from "../../helpers/findTheFirstAccessibleRoutePath";
import * as authSelectors from "../../redux/selectors/auth";
import QuoteBoardBroker from "./QuoteBoardBroker";
import QuoteBoardInvestor from "./QuoteBoardInvestor";

const Bulletin = () => {
  const currentListOfAcls = useSelector(authSelectors.selectCurrentListOfAcls);
  const currentEntityType = useSelector(authSelectors.selectCurrentEntityType);

  const PILL_ROUTE_CONFIGS = [
    {
      path: routes.dashboard.bulletins.view,
      link: routes.dashboard.bulletins.view,
      text: "Minor Navigation.Bulletin Board.Bulletin Board",
      disabled:
        !authorizeRouteAccess(currentListOfAcls, [accessControlsList.QUOTES.view.key]) ||
        !["EMRGO_SERVICES", "INVESTOR"].includes(currentEntityType),
    },
    {
      path: routes.dashboard.bulletins.manage,
      link: routes.dashboard.bulletins.manage,
      text: "Minor Navigation.Bulletin Board.Bulletin Board",
      disabled:
        !authorizeRouteAccess(currentListOfAcls, [accessControlsList.QUOTES.manage.key]) ||
        !["BROKER"].includes(currentEntityType),
    },
  ];

  const nextAccessibleRoutePath = findTheFirstAccessibleRoutePath(PILL_ROUTE_CONFIGS);

  return (
    <Fragment>
      <MinorNavbar routes={PILL_ROUTE_CONFIGS} />
      <Routes>
        <Route exact path={routes.dashboard.bulletins.home}>
          <Navigate to={nextAccessibleRoutePath} />
        </Route>
        <Route exact path={routes.dashboard.bulletins.view}>
          <QuoteBoardInvestor />
        </Route>
        <Route exact path={routes.dashboard.bulletins.manage}>
          <QuoteBoardBroker />
        </Route>
      </Routes>
    </Fragment>
  );
};

export default Bulletin;
