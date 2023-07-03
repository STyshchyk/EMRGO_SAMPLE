import { matchPath, useLocation, useMatch } from "react-router-dom";

import { clientModuleURLs } from "@emrgo-frontend/constants";
import { IIssuance } from "@emrgo-frontend/types";

export const buildModuleURL = (module: string, path: string) => {
  const baseUrl = clientModuleURLs[module];
  const fullPath = `${baseUrl}${path}`;
  return fullPath;
};

export const navigateModule = (module: string, path: string) => {
  const fullPath = buildModuleURL(module, path);
  window.location.assign(fullPath);
};

export const useMatchedPath = (tabs: { paths: string[]; key: string }[]) => {
  const matchedValues = tabs.find((tab) => {
    let isMatched = false;
    tab.paths.forEach((path) => {
      const match = useMatch(path);
      if (match) {
        isMatched = true;
      }
    });

    return isMatched;
  });
  return matchedValues?.key || "";
};

export const useClientMatchedPathSidebar = (paths: string[]) => {
  let isMatched = false;
  paths.forEach((path) => {
    const match = useMatch(path);
    if (match) {
      isMatched = true;
    }
  });
  return isMatched;
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
  tabs.forEach(tab => {
    tab.paths.forEach(tabName => {
      const match = useMatch(tabName);
      if (match) matchedValue = tab;
    });
  });
  return matchedValue.key ?? "";
};


export const useClientMatchedPathDashboard = (tabs: { paths: string; key: string }) => {
  const location = useLocation();
  const { pathname } = location;
  const match = matchPath({ path: tabs.paths, end: false, caseSensitive: false }, pathname);
  return match?.pathname || "";
};

const buildparentURLs = (urlComponents: string[]) => {
  const paths: string[] = [];

  urlComponents.forEach((component, index) => {
    const chunk = urlComponents.slice(0, index + 1);
    const currentPath = `/${chunk.join("/")}`;
    paths.push(currentPath);
  });

  return paths;
};

export const issuanceBreadcrumbRoutes = (
  route: string,
  issuance: Partial<IIssuance> | undefined
) => {
  const urlComponents = route.split("/").filter((component) => component !== "");
  const paths = buildparentURLs(urlComponents);

  const breadCrumbs = paths.map((path, index) => {
    const crumb = {
      title: "",
      path: path,
      isCurrent: paths.length - 1 === index
    };
    switch (index) {
      case 0:
        crumb.title = "Trade Opportunities";
        break;
      case 1:
        crumb.title = "removed";
        break;
      case 2:
        crumb.title = issuance?.sellSide?.name || "-";
        break;
      case 3:
        crumb.title = issuance?.name || "-";
        break;
      case 4:
        crumb.title = "Data Room";
        break;
      default:
        break;
    }

    return crumb;
  });

  const filteredBreadCrumbs = breadCrumbs.filter((crumb) => crumb.title !== "removed");
  return filteredBreadCrumbs;
};
