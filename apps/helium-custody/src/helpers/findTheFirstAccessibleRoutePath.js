import routes from "../constants/routes";

const findTheFirstAccessibleRoutePath = (routeConfigs) => {
  if (Array.isArray(routeConfigs)) {
    const enabledRoutes = routeConfigs.filter((i) => i.disabled === false);

    if (enabledRoutes.length > 0) {
      return routeConfigs.filter((i) => i.disabled === false)[0].path;
    }
  }

  return routes.dashboard.home;
};

export default findTheFirstAccessibleRoutePath;
