import { Fragment, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes, useMatch, useNavigate } from "react-router-dom";

import { clientAuthenticationRoutes } from "@emrgo-frontend/constants";
import { navigateModule } from "@emrgo-frontend/utils";

import routes from "../../constants/routes";
import { useAuth } from "../../context/auth-context";
import { RouterMappingProvider, useRouterMapping } from "../../context/router-mapping-context";
import LocationDisplay from "../LocationDisplay";
import NotFound from "../NotFound";

const RequireAuth = ({ children, redirectTo = routes.public.login }) => {
  const { data } = useAuth();
  const authOtpRouteMatch = useMatch(routes.authentication.otp);

  if (!data?.isAuthenticated) return <Navigate to={redirectTo} />;

  if (!authOtpRouteMatch && data?.isMFAEnabled && !data?.isMFAVerified)
    return <Navigate to={routes.authentication.otp} />;

  return children;
};

// const RequireAuth = ({ children, redirectTo = routes.public.login }) => {
//   const { data } = useAuth();
  
//   if (!data?.isAuthenticated){
//     navigateModule("authentication",clientAuthenticationRoutes.home)
//   }

//   if (data?.isMFAEnabled && !data?.isMFAVerified){
//     navigateModule("authentication",clientAuthenticationRoutes.setupTwoFactorAuth)
//   }

//   return children;
// };

const MainRoutes = () => {
  const navigate = useNavigate();
  const { publicRouteConfigs, authFlowRouteConfigs, dashboardRouteConfigs } = useRouterMapping();

  useEffect(() => {
    if (navigate.action === "POP") {
      return;
    }

    try {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } catch (error) {
      window.scrollTo(0, 0);
    }
  });

  // TODO: Convert <Route render={() => ...}> to <Route element={...}> when upgrading React Router to v6
  const makeRoutes = (routeConfigs) =>
    routeConfigs
      .filter(({ disabled }) => !disabled)
      .map(({ path, component: Component, layout: Layout, isPublic }) => {
        if (!isPublic)
          return (
            <Route
              path={path}
              key={path}
              element={
                //! change it to client-auth app route
                <RequireAuth>
                  <Layout>
                    <Component />
                  </Layout>
                </RequireAuth>
              }
            />
          );

        return (
          <Route
            key={path}
            path={path}
            element={
              <Layout>
                <Component />
              </Layout>
            }
          />
        );
      });

  /*
  const publicRoutes = makeRoutes(publicRouteConfigs);
  const authFlowRoutes = makeRoutes(authFlowRouteConfigs);
  const dashboardRoutes = makeRoutes(dashboardRouteConfigs);
  */

  const generatedRouteComponents = makeRoutes([
    ...publicRouteConfigs,
    ...authFlowRouteConfigs,
    ...dashboardRouteConfigs,
  ]);

  /* {generatedRouteComponents || <Fragment />} */

  return (
    <Fragment>
      {process.env.NODE_ENV === "test" && <LocationDisplay />}
      <Routes>
        {generatedRouteComponents}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Fragment>
  );
};

const AppRoutes = () => {
  const { t } = useTranslation(["translation"]);
  return (
    <RouterMappingProvider>
      <Suspense fallback={<h1>{t("translation:Miscellaneous.Loading Page")}</h1>}>
        <MainRoutes />
      </Suspense>
    </RouterMappingProvider>
  );
};
export default AppRoutes;
