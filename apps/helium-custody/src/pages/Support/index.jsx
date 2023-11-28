import { Fragment, lazy } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Link as RouterLink, Routes } from "react-router-dom";

import { Tab, Tabs } from "@emrgo-frontend/shared-ui";
import Box from "@mui/material/Box";

import routes from "../../constants/routes";

const TFA = lazy(() => import("./TFA"));

const Support = () => {
  const { t } = useTranslation();
  const supportRoutes = [
    {
      path: routes.dashboard.support.tfa,
      link: routes.dashboard.support.tfa,
      text: "Minor Navigation.Support.2FA Tickets",
    },
  ];
  return (
    <Fragment>
      <Tabs value={supportRoutes[0].link}>
        {supportRoutes.map((tab, index) => {
          return (
            <Tab value={tab.link} as={RouterLink} to={tab.path} key={tab.link}>
              {t(`${tab.text}`)}
            </Tab>
          );
        })}
      </Tabs>
      <div
        style={{
          marginTop: "1rem",
        }}
      >
        <Box sx={{ py: "2rem", px: "2rem" }}>
          <Routes>
            <Route
              exact
              path={"/"}
              element={<Navigate to={routes.dashboard.support.tfa} />}
            ></Route>
            <Route exact path={"/tfa"} element={<TFA />}></Route>
          </Routes>
        </Box>
      </div>
    </Fragment>
  );
};
export default Support;
