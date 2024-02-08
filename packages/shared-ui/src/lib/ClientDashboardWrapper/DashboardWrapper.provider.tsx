import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";

import * as constants from "@emrgo-frontend/constants";
import {
  acceptClientTerms,
  acceptPlatformTerms,
  fetchDocumentLink,
  fetchDocumentPath,
  fetchUserProfile,
  logoutUser,
  refreshToken,
} from "@emrgo-frontend/services";
import {
  useFetchUndeadGroupsCount,
  useRefreshProfile,
  useToast,
  useUser,
} from "@emrgo-frontend/shared-ui";
import { navigateModule } from "@emrgo-frontend/utils";
import { useMutation, useQuery } from "@tanstack/react-query";

import { CustodyIcon, PrimariesIcon, ResearchIcon, SecondariesIcon } from "../Icons";
import { IDashboardWrapperContext, IRoleSelector } from "./DashboardWrapper.types";

const DashboardWrapperContext = createContext<IDashboardWrapperContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const DashboardWrapperProvider = ({ children }: PropsWithChildren) => {
  const { user, roles, updateUserConfig } = useUser();

  const refreshProfile = useRefreshProfile();
  const { showWarningToast, showInfoToast } = useToast();
  const currentRole = constants.roles.find((role) => role.key === user?.role);
  const fullName = user ? `${user?.firstName} ${user?.lastName}` : "N.A";
  const [isHelpDeskOpen, setHelpDeskOpen] = useState(false);

  const origin = window.location.origin;
  const { mutate: doRefreshToken } = useMutation(refreshToken);
  const { mutate: doLogoutUser } = useMutation(logoutUser);
  const { mutate: doAcceptClientTerms } = useMutation(acceptClientTerms);
  const { mutate: doAcceptPlatformTerms } = useMutation(acceptPlatformTerms);
  const [showTermsModal, setShowTermsModal] = useState("");
  const [termsDocumentURL, setTermsDocumentURL] = useState("");
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const { showSuccessToast, showErrorToast } = useToast();
  const { data } = useFetchUndeadGroupsCount("client");
  useEffect(() => {
    if (user) {
      if (!user?.hasAcceptedSilverTnc) {
        setShowTermsModal("tnc");
      }

      // if (user?.hasAcceptedSilverTnc && !user?.hasAcceptedClientTerms) {
      //   setShowTermsModal("client_terms");
      // }
    }
  }, [user]);

  const { data: documentDetails } = useQuery(
    [constants.queryKeys.miscelleneous.documents.fetchPath, showTermsModal],
    {
      staleTime: 60 * 60,
      queryFn: () => fetchDocumentPath({ documentType: showTermsModal }),
      enabled: showTermsModal !== "",
    }
  );

  const documentPath = documentDetails?.path || "";

  useQuery([constants.queryKeys.miscelleneous.documents.fetchLink, documentPath], {
    staleTime: 60 * 60,
    queryFn: () => fetchDocumentLink({ path: documentPath }),
    enabled: documentPath !== "",
    onSuccess: (response) => {
      setTermsDocumentURL(response?.url);
    },
  });

  const currentModuleKey =
    Object.keys(constants.clientModuleURLs).find(
      (key) => constants.clientModuleURLs[key] === origin
    ) || "";

  // console.log(currentModuleKey,"module key")

  useQuery([constants.queryKeys.account.profile.fetch], {
    queryFn: () => fetchUserProfile(),
    staleTime: Infinity,
    // enabled: currentModuleKey !== 'custody',
    onSuccess: (response) => {
      const user = response;
      updateUserConfig(user);
    },
  });

  useEffect(() => {
    if (currentRole && !currentRole?.access.includes(currentModuleKey)) {
      setTimeout(() => {
        const message = `You do not have access to the ${currentModuleKey} module`;
        showWarningToast(message);
      }, 1000);
      setTimeout(() => {
        navigateToModule(currentRole?.module || "", currentRole?.route || "");
      }, 2000);
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
      disabled: true,
    },
    {
      label: "Secondaries",
      icon: <SecondariesIcon />,
      key: "secondaries",
      path: constants.clientSecondariesRoutes.home,
      paths: constants.getAllRoutes(constants.clientSecondariesRoutes),
      disabled: true,
    },
    {
      label: "Custody",
      icon: <CustodyIcon />,
      key: "custody",
      path: constants.clientCustodyRoutes.custody.onboarding.home,
      paths: constants.getAllRoutes(constants.clientCustodyRoutes),
      disabled: false,
    },
    {
      label: "Research",
      icon: <ResearchIcon />,
      key: "research",
      path: constants.clientSecondariesRoutes.home,
      paths: [""],
      disabled: true,
    },
  ];

  const allAccountRoutes = constants.getAllRoutes(constants.clientAccountRoutes.account);

  const onRejectPlatformTerms = () => {
    if (user?.hasAcceptedSilverTnc) {
      // According to Bug ID 838: Even if terms modal shows, clicking on close button won't log out user
      setShowTermsModal("");
      return;
    }
    onLogOut();
  };

  const onAcceptPlatformTerms = () => {
    doAcceptPlatformTerms(undefined, {
      onSuccess: (response) => {
        refreshProfile();
        setTimeout(() => {
          showSuccessToast("Successfully accepted platform terms and conditions");
        }, 1000);
      },
    });
    resetTermsModal();
  };

  const resetTermsModal = () => {
    setShowTermsModal("");
    setTermsDocumentURL("");
  };

  const changeUserRole = (role: IRoleSelector) => {
    doRefreshToken(role.key, {
      onSuccess: () => {
        refreshProfile();
        const message = `Switching role to ${role.label}. Please wait...`;
        showInfoToast(message);
        setTimeout(() => {
          navigateToModule(role.module, role.route);
        }, 1000);
      },
    });
  };

  const onLogOut = () => {
    doLogoutUser(undefined, {
      onSuccess: (response) => {
        navigateToModule("authentication", constants.clientAuthenticationRoutes.home);
      },
    });
  };

  const state: IDashboardWrapperContext = {
    numberOfNotifications: data ?? 0,
    user,
    roles,
    showTermsModal,
    termsDocumentURL,
    mainRoutes,
    fullName,
    currentModule: currentModuleKey,
    currentRole,
    allAccountRoutes,
    navigateToModule,
    changeUserRole,
    onLogOut,
    onAcceptPlatformTerms,
    onRejectPlatformTerms,
    isHelpDeskOpen,
    setHelpDeskOpen,
  };

  return (
    <DashboardWrapperContext.Provider value={state}>{children}</DashboardWrapperContext.Provider>
  );
};

export const useDashboardWrapperContext = () => useContext(DashboardWrapperContext);
