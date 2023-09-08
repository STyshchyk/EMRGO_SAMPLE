import { useMatch } from "react-router-dom";

import { silverModuleURLs } from "@emrgo-frontend/constants";

export enum silverModule {
  authentication = "authentication",
  administration = "administration",
  primaries = "primaries",
  onboarding = "onboarding",
  dataroom = "dataroom",
  custody = "custody",
}

export const buildSilverModuleURL = (module: string, path: string) => {
  const baseUrl = silverModuleURLs[module];
  const fullPath = `${baseUrl}${path}`;
  return fullPath;
};

export const navigateSilverModule = (module: string, path: string) => {
  const fullPath = buildSilverModuleURL(module, path);
  console.log(fullPath);
  window.location.assign(fullPath);
};

export const useInternalMatchedPathDashboard = (tabs: { paths: string[]; key: string }) => {
  let matchedValue = false;
  tabs.paths.forEach((pathname) => {
    const match = useMatch({ path: pathname, end: true, caseSensitive: false });
    if (match) matchedValue = true;
  });
  return matchedValue ? tabs.key : "";
};

export const useInternalMatchedPathTabs = (tabs: { paths: string[]; key: string }[]) => {
  let matchedValue: any = null;
  tabs.forEach((tab) => {
    tab.paths.forEach((tabName) => {
      const match = useMatch(tabName);
      if (match) matchedValue = tab;
    });
  });
  return matchedValue.key ?? "";
};
