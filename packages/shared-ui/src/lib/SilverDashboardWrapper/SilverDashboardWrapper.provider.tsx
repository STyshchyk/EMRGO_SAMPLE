import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useCopyToClipboard } from "react-use";

import * as constants from "@emrgo-frontend/constants";
import {
  getAllSilverRoutes,
  heliumCustodyRoutes,
  silverAdministrationRoutes,
  silverAuthenticationRoutes,
  silverDataRoomRoutes,
  silverOnboardingRoutes,
  silverPrimariesRoutes,
} from "@emrgo-frontend/constants";
import { fetchUserProfile, logoutUser } from "@emrgo-frontend/services";
import { PrimariesIcon, useToast, useUser } from "@emrgo-frontend/shared-ui";
import { navigateSilverModule, silverModule } from "@emrgo-frontend/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useDarkMode } from "usehooks-ts";

import { ISilverDashboardWrapperContext } from "./SilverDashboardWrapper.types";

const DashboardWrapperContext = createContext<ISilverDashboardWrapperContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the SilverDashboardWrapper template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */

export const SilverDashboardWrapperProvider = ({ children }: PropsWithChildren) => {
  const { disable } = useDarkMode();
  const { user, roles, updateUserConfig } = useUser();
  const currentRole = constants.silverRoles.find((role) => role.key === user?.role);
  const { showWarningToast, showInfoToast } = useToast();
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const { showSuccessToast, showErrorToast } = useToast();
  const [enableRoleMapping, setRoleMapping] = useState(true);
  useLayoutEffect(() => {
    disable();
  }, []);
  const { mutate: doLogout } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      navigateSilverModule(silverModule.authentication, silverAuthenticationRoutes.home);
    },
  });

  const { data: userData } = useQuery([constants.queryKeys.account.profile.fetch], {
    queryFn: () => fetchUserProfile(),
    keepPreviousData: false,
    refetchOnMount: true,
    onSuccess: (response) => {
      const user = response;
      updateUserConfig(user);
    },
  });
  const mainRoutes = [
    {
      label: "Administration",
      icon: <PrimariesIcon />,
      key: "administration",
      path: silverAdministrationRoutes.home,
      paths: getAllSilverRoutes(silverAdministrationRoutes),
    },
    {
      label: "Primaries",
      icon: <PrimariesIcon />,
      key: "primaries",
      path: silverPrimariesRoutes.home,
      paths: getAllSilverRoutes(silverPrimariesRoutes),
    },
    {
      label: "Onboarding",
      icon: <PrimariesIcon />,
      key: "onboarding",
      path: silverOnboardingRoutes.home,
      paths: getAllSilverRoutes(silverOnboardingRoutes),
    },
    {
      label: "Data Room",
      icon: <PrimariesIcon />,
      key: "dataroom",
      path: silverDataRoomRoutes.home,
      paths: getAllSilverRoutes(silverDataRoomRoutes),
    },
    {
      label: "Custody",
      icon: <PrimariesIcon />,
      key: "custody",
      path: heliumCustodyRoutes.home,
      paths: getAllSilverRoutes(heliumCustodyRoutes),
    },
  ];

  function removeHttp(url: string) {
    return url.replace(/^https?:\/\//, "");
  }

  useEffect(() => {
    const currentModuleKey =
      Object.keys(constants.silverModuleURLs).find(
        (key) => removeHttp(constants.silverModuleURLs[key]) === removeHttp(window.location.origin)
      ) || "";
    if (enableRoleMapping && currentRole && !currentRole?.access.includes(currentModuleKey)) {
      setTimeout(() => {
        const message = `You do not have access to the ${currentModuleKey} module`;
        showWarningToast(message);
      }, 1500);
      setTimeout(() => {
        navigateSilverModule(currentRole?.module || "", currentRole?.route || "");
      }, 2000);
    }
  }, [currentRole, enableRoleMapping]);
  const state: ISilverDashboardWrapperContext = {
    user: user,
    roles: roles,
    mainRoutes: mainRoutes,
    doLogout,
    currentRole,
    enableRoleMapping: enableRoleMapping,
  };

  return (
    <DashboardWrapperContext.Provider value={state}>{children}</DashboardWrapperContext.Provider>
  );
};

export const useSilverDashboardWrapperContext = () => useContext(DashboardWrapperContext);
