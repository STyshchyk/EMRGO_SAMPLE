import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";

import * as constants from "@emrgo-frontend/constants";
import {
  acceptClientTerms,
  acceptPlatformTerms,
  fetchDocumentLink,
  fetchDocumentPath,
  fetchPlatformDocument,
  fetchUserProfile,
  logoutUser,
} from "@emrgo-frontend/services";
import { useRefreshProfile, useToast, useUser } from "@emrgo-frontend/shared-ui";
import { navigateModule } from "@emrgo-frontend/utils";
import { useMutation, useQuery } from "@tanstack/react-query";

import { IPrimariesWrapperContext } from "./PrimariesWrapper.types";

const PrimariesWrapperContext = createContext<IPrimariesWrapperContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const PrimariesWrapperProvider = ({ children }: PropsWithChildren) => {
  const { user, updateUser } = useUser();
  const refreshProfile = useRefreshProfile();
  const { mutate: doLogoutUser } = useMutation(logoutUser);
  const { mutate: doAcceptClientTerms } = useMutation(acceptClientTerms);
  const { mutate: doAcceptPlatformTerms } = useMutation(acceptPlatformTerms);
  const [showTermsModal, setShowTermsModal] = useState("tnc");
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

  const resetTermsModal = () => {
    setShowTermsModal("");
    setTermsDocumentURL("");
  };

  useQuery([constants.queryKeys.account.profile.fetch], {
    queryFn: () => fetchUserProfile(),
    onSuccess: (response) => {
      const user = response;
      updateUser(user);
    },
  });

  const onAcceptPlatformTerms = () => {
    doAcceptPlatformTerms(undefined, {
      onSuccess: (response) => {
        refreshProfile();
        showSuccessToast("Successfully accepted platform terms and conditions");
      },
    });
    resetTermsModal();
  };

  const onAcceptClientTerms = () => {
    doAcceptClientTerms(undefined, {
      onSuccess: () => {
        refreshProfile();
        showSuccessToast("Successfully accepted client terms and conditions");
      },
    });
    resetTermsModal();
  };

  const onRejectClientTerms = () => {
    doLogoutUser(null, {
      onSuccess: () => {
        updateUser(null);
        navigateModule("authentication", constants.clientAuthenticationRoutes.login);
      },
    });
  };

  const onRejectPlatformTerms = () => {
    resetTermsModal();
  };

  const state: IPrimariesWrapperContext = {
    numberOfNewTradeOpportunities: 1,
    numberOfNotifications: 1,

    user,

    onAcceptPlatformTerms,
    onRejectPlatformTerms,
    onAcceptClientTerms,
    onRejectClientTerms,

    showTermsModal,
    termsDocumentURL,
  };

  return (
    <PrimariesWrapperContext.Provider value={state}>{children}</PrimariesWrapperContext.Provider>
  );
};

export const usePrimariesWrapperContext = () => useContext(PrimariesWrapperContext);
