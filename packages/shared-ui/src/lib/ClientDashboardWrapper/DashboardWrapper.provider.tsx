import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import * as constants from "@emrgo-frontend/constants";
import { fetchUserProfile, refreshToken } from "@emrgo-frontend/services";
import { navigateModule } from "@emrgo-frontend/utils";
import { useMutation, useQuery } from "@tanstack/react-query";

import { CustodyIcon, PrimariesIcon, ResearchIcon, SecondariesIcon } from "../Icons";
import { useToast } from "../Toast";
import { useUser } from "../UserContext";
import { IDashboardWrapperContext, IRoleSelector } from "./DashboardWrapper.types";

const DashboardWrapperContext = createContext<IDashboardWrapperContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const DashboardWrapperProvider = ({ children }: PropsWithChildren) => {
  const { user, updateUser } = useUser();
  const { showWarningToast, showInfoToast } = useToast();
  const currentRole = constants.roles.find((role) => role.key === user?.role);
  const fullName = user ? `${user?.firstName} ${user?.lastName}` : "N.A";

  const origin = window.location.origin;
  const { mutate: doRefreshToken } = useMutation(refreshToken);

  const currentModuleKey =
    Object.keys(constants.clientModuleURLs).find(
      (key) => constants.clientModuleURLs[key] === origin
    ) || "";

  useEffect(() => {
    if (!currentRole?.access.includes(currentModuleKey)) {
      const message = `You do not have access to the ${currentModuleKey} module`;
      showWarningToast(message);
      setTimeout(() => {
        navigateToModule(currentRole?.module || "", currentRole?.route || "");
      }, 1000);
    }
  }, [currentModuleKey, currentRole, showWarningToast]);

  const navigateToModule = (module: string, path: string) => {
    navigateModule(module, path);
  };

  const mainRoutes = [
    {
      label: "Primaries",
      icon: <PrimariesIcon />,
      key: "primaries",
      path: constants.clientPrimariesRoutes.home,
      paths: constants.getAllRoutes(constants.clientPrimariesRoutes),
    },
    {
      label: "Secondaries",
      icon: <SecondariesIcon />,
      key: "secondaries",
      path: constants.clientSecondariesRoutes.home,
      paths: constants.getAllRoutes(constants.clientSecondariesRoutes),
    },
    {
      label: "Custody",
      icon: <CustodyIcon />,
      key: "custody",
      path: constants.clientCustodyRoutes.custody.cashManagement.home,
      paths: constants.getAllRoutes(constants.clientCustodyRoutes),
    },
    {
      label: "Research",
      icon: <ResearchIcon />,
      key: "research",
      path: constants.clientSecondariesRoutes.home,
      paths: [""],
    },
  ];

  const allAccountRoutes = constants.getAllRoutes(constants.clientAccountRoutes);

  const { refetch: userProfileRefetch } = useQuery([constants.queryKeys.account.profile.fetch], {
    staleTime: 60 * 60,
    queryFn: () => fetchUserProfile(),
    onSuccess: (response) => {
      const user = response;
      updateUser(user);
    },
  });

  const changeUserRole = (role: IRoleSelector) => {
    doRefreshToken(role.key, {
      onSuccess: () => {
        userProfileRefetch();
        const message = `Switching role to ${role.label}. Please wait...`;
        showInfoToast(message);
        setTimeout(() => {
          navigateModule(role.module, role.route);
        }, 2000);
      },
    });
  };

  const state: IDashboardWrapperContext = {
    numberOfNotifications: 1,
    mainRoutes,
    fullName,
    currentModule: currentModuleKey,
    currentRole,
    allAccountRoutes,
    navigateToModule,
    changeUserRole,
  };

  return (
    <DashboardWrapperContext.Provider value={state}>{children}</DashboardWrapperContext.Provider>
  );
};

export const useDashboardWrapperContext = () => useContext(DashboardWrapperContext);
