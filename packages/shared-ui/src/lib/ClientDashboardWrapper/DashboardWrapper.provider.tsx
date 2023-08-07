import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { IDashboardWrapperContext } from "./DashboardWrapper.types";
import { useRefreshProfile, useToast, useUser } from "@emrgo-frontend/shared-ui";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  acceptClientTerms,
  acceptPlatformTerms,
  fetchDocumentLink,
  fetchDocumentPath, fetchUserProfile,
  logoutUser
} from "@emrgo-frontend/services";
import { useCopyToClipboard } from "react-use";
import * as constants from "@emrgo-frontend/constants";
import { navigateModule } from "@emrgo-frontend/utils";

const DashboardWrapperContext = createContext<IDashboardWrapperContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the SilverDashboardWrapper template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const DashboardWrapperProvider = ({ children }: PropsWithChildren) => {
  const { user, updateUser } = useUser();
  const refreshProfile = useRefreshProfile();
  const { mutate: doLogoutUser } = useMutation(logoutUser);
  const { mutate: doAcceptClientTerms } = useMutation(acceptClientTerms);
  const { mutate: doAcceptPlatformTerms } = useMutation(acceptPlatformTerms);
  const [showTermsModal, setShowTermsModal] = useState("");
  const [termsDocumentURL, setTermsDocumentURL] = useState("");
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const { showSuccessToast, showErrorToast } = useToast();
  useEffect(() => {
    if (user) {
      if (!user?.hasAcceptedSilverTnc) {
        setShowTermsModal("tnc");
      }

      if (user?.hasAcceptedSilverTnc && !user?.hasAcceptedClientTerms) {
        setShowTermsModal("client_terms");
      }
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


  useQuery([constants.queryKeys.account.profile.fetch], {
    queryFn: () => fetchUserProfile(),
    onSuccess: (response) => {
      const user = response;
      updateUser(user);
    },
  });


  const onRejectPlatformTerms = () => {
    resetTermsModal();
  };
  const onAcceptPlatformTerms = () => {
    doAcceptPlatformTerms(undefined, {
      onSuccess: (response) => {
        refreshProfile();
        showSuccessToast("Successfully accepted platform terms and conditions");
      },
    });
    resetTermsModal();
  };
  const resetTermsModal = () => {
    setShowTermsModal("");
    setTermsDocumentURL("");
  };
  const state: IDashboardWrapperContext = {
    numberOfNotifications: 1,
    onAcceptPlatformTerms,
    onRejectPlatformTerms,
    user,
    showTermsModal,
    termsDocumentURL,
  };

  return (
    <DashboardWrapperContext.Provider value={state}>{children}</DashboardWrapperContext.Provider>
  );
};

export const useDashboardWrapperContext = () => useContext(DashboardWrapperContext);
