import { useEffect, Suspense } from 'react';
import { Switch, Route, useHistory, useRouteMatch, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../context/auth-context';
import { useRouterMapping, RouterMappingProvider } from '../../context/router-mapping-context';
import LocationDisplay from '../LocationDisplay';
import NotFound from '../NotFound';
import routes from '../../constants/routes';

const RequireAuth = ({ children, redirectTo = routes.public.login }) => {
  const { data } = useAuth();
  const authOtpRouteMatch = useRouteMatch(routes.authentication.otp);

  if (!data?.isAuthenticated) return <Redirect to={redirectTo} />;

  if (!authOtpRouteMatch && data?.isMFAEnabled && !data?.isMFAVerified) return <Redirect to={routes.authentication.otp} />;

  return children;
};

const MainRoutes = () => {
  const { t } = useTranslation(['translation']);
  const history = useHistory();
  const { publicRouteConfigs, authFlowRouteConfigs, dashboardRouteConfigs } = useRouterMapping();

  useEffect(() => {
    if (history.action === 'POP') {
      return;
    }

    try {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      window.scrollTo(0, 0);
    }
  });

  // TODO: Convert <Route render={() => ...}> to <Route element={...}> when upgrading React Router to v6
  const makeRoutes = (routeConfigs) =>
    routeConfigs
      .filter(({ disabled }) => !disabled)
      .map(({ exact, path, component: Component, layout: Layout, isPublic }) => {
        const routeProps = {
          key: path,
          exact,
          path,
        };

        if (!isPublic)
          return (
            <Route
              {...routeProps}
              render={() => (
                <RequireAuth redirectTo={routes.public.login}>
                  <Layout>
                    <Component />
                  </Layout>
                </RequireAuth>
              )}
            />
          );

        return (
          <Route {...routeProps}>
            <Layout>
              <Component />
            </Layout>
          </Route>
        );
      });

  /*
  const publicRoutes = makeRoutes(publicRouteConfigs);
  const authFlowRoutes = makeRoutes(authFlowRouteConfigs);
  const dashboardRoutes = makeRoutes(dashboardRouteConfigs);
  */

  const generatedRouteComponents = makeRoutes([...publicRouteConfigs, ...authFlowRouteConfigs, ...dashboardRouteConfigs]);

  return (
    <Suspense fallback={<h1>{t('translation:Miscellaneous.Loading Page')}</h1>}>
      {process.env.NODE_ENV === 'test' && <LocationDisplay />}
      <Switch>
        {generatedRouteComponents}
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Suspense>
  );
};

const AppRoutes = () => (
  <RouterMappingProvider>
    <MainRoutes />
  </RouterMappingProvider>
);
export default AppRoutes;
