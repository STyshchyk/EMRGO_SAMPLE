import appConfig from '../appConfig';

const RELEASE_ENVS = ['staging', 'production', 'local'];

// () => boolean (true if app is in production)
// !NOT A REACT HOOK
const useIsProduction = () => {
  const inProd = RELEASE_ENVS.includes(appConfig.appENV);

  return inProd;
};

export default useIsProduction;
