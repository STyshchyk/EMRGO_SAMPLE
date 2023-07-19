import appConfig from '../appConfig';

const buildElmAuthAPIURL = (redirectURL, errorURL, currentEntityGroupID) => {
  const baseElmAuthAPIURL = new URL(`${appConfig.baseAPIURL}v1/auth/elmAuth`);

  baseElmAuthAPIURL.searchParams.append('redirectUri', redirectURL);
  baseElmAuthAPIURL.searchParams.append('errorUri', errorURL);
  baseElmAuthAPIURL.searchParams.append('currentGroupId', currentEntityGroupID);

  return baseElmAuthAPIURL;
};

export default buildElmAuthAPIURL;
