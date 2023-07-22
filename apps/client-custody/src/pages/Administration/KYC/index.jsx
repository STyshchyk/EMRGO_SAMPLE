import { Fragment, lazy } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

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
        <Routes>
          <Route exact path={routes.dashboard.administration.entityDetails.kyc.entities.home}>
            <KYCEntitiesList />
          </Route>
        </Routes>
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
