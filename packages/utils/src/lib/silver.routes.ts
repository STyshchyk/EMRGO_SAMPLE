import { matchPath, useLocation, useMatch } from "react-router-dom";

import { silverModuleURLs } from "@emrgo-frontend/constants";

export enum silverModule {
  authentication = "authentication",
  administration = "administration",
  primaries = "primaries",
  onboarding = "onboarding",
  dataroom = "dataroom",
}

export const buildSilverModuleURL = (module: silverModule, path: string) => {
  const baseUrl = silverModuleURLs[module];
  const fullPath = `${baseUrl}${path}`;
  return fullPath;
};


export const navigateSilverModule = (module: silverModule, path: string) => {
  const fullPath = buildSilverModuleURL(module, path);
  window.location.assign(fullPath);
};

export const useInternalMatchedPathDashboard = (tabs: { paths: string[]; key: string }) => {
  let matchedValue = false;
  tabs.paths.forEach(pathname => {
    const match = useMatch({ path: pathname, end: true, caseSensitive: false });
    if (match) matchedValue = true;
  });
  return matchedValue ? tabs.key : "";
};

export const useInternalMatchedPathTabs = (tabs: { paths: string[]; key: string }[]) => {
  let matchedValue: any = null;
  const {pathname} = useLocation()

  tabs.forEach(tab => {
    tab.paths.forEach(tabName => {
      const match = useMatch({ path: pathname, end: true, caseSensitive: false });
      if (match) matchedValue = tab;
    });
  });

  return matchedValue ? pathname : "";
};



