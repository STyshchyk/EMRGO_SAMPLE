import { Fragment, lazy } from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

import routes from "../../../constants/routes";
import * as authSelectors from "../../../redux/selectors/auth";

const KYCEntitiesList = lazy(() => import("./KYCEntitiesList"));

const KYC = () => {
  const currentEntityGroup = useSelector(authSelectors.selectCurrentEntityGroup);

  const entities = [];
  entities.push(currentEntityGroup?.entity);

  return (
    <Fragment>
      <div dir="ltr" className="rtl__disabled">
        <Switch>
          <Route exact path={routes.dashboard.administration.entityDetails.kyc.entities.home}>
            <KYCEntitiesList />
          </Route>
        </Switch>
      </div>
      <div
        style={{
          marginTop: "1rem",
        }}
      />
    </Fragment>
  );
};

export default KYC;
