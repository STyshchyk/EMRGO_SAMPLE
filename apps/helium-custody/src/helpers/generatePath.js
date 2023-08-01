// Parameterize a route path

const generatePath = (to, params = {}) => {
  let computedPath = to;

  Object.keys(params).forEach((key) => {
    computedPath = computedPath.replace(`:${key}`, params[key]);
  });

  return computedPath;
};

export default generatePath;
