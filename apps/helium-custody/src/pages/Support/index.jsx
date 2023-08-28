import { Fragment, lazy } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes } from "react-router-dom";

import MinorNavigation from "../../components/MinorNavigation";
import MinorNav from "../../components/MinorNavbar";
import PageTitle from "../../components/PageTitle";
import routes from "../../constants/routes";

const TFA = lazy(() => import("./TFA"));

const Support = () => {
  const { t } = useTranslation(["support"]);
  return (
    <Fragment>
      {/* <PageTitle title={t('support:Support')} /> */}
      <MinorNav
        routes={[
          {
            path: routes.dashboard.support.tfa,
            link: routes.dashboard.support.tfa,
            text: "Minor Navigation.Support.2FA Tickets",
          },
        ]}
      />
      <div
        style={{
          marginTop: "1rem",
        }}
      >
        <Routes>
          <Route exact path={'/'} element={<Navigate to={routes.dashboard.support.tfa}/>}></Route>
          <Route exact path={'/tfa'} element={<TFA/>}></Route>
        </Routes>

      </div>
    </Fragment>
  );
};
export default Support;
