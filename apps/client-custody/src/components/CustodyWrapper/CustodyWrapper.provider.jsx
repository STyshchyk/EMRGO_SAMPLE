import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";

import * as constants from "@emrgo-frontend/constants";
import {
  acceptClientTerms,
  fetchDocumentLink,
  fetchDocumentPath,
  fetchUserProfile,
  logoutUser,
} from "@emrgo-frontend/services";
import { useRefreshProfile, useToast, useUser } from "@emrgo-frontend/shared-ui";
import { navigateModule } from "@emrgo-frontend/utils";
import { useMutation, useQuery } from "@tanstack/react-query";

const CustodyWrapperContext = createContext();

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const CustodyWrapperProvider = ({ children }) => {
  const { user, updateUser } = useUser();
  const refreshProfile = useRefreshProfile();
  const { mutate: doLogoutUser } = useMutation(logoutUser);
  const { mutate: doAcceptClientTerms } = useMutation(acceptClientTerms);
  const [showTermsModal, setShowTermsModal] = useState("tnc");
  const [termsDocumentURL, setTermsDocumentURL] = useState("");
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const { showSuccessToast, showErrorToast } = useToast();

  const hasCompletedInvestorProfileIdentification =
    user?.clientKycStatus === constants.accountIdentification.KYC_STATUS_APPROVED;

  useEffect(() => {
    if (user) {
      // We've already checked this condition in the clientDashboard wrapper.
      // The shared provider and component handle the display of the platform's (TNC) modal.
      // if (!user?.hasAcceptedSilverTnc) {
      //   setShowTermsModal("tnc");
      // }

      // custody wrapper component takes care of rendering the modal instead of shared clientDashboard wrapper.
      if (
        user?.hasAcceptedSilverTnc &&
        !user?.hasAcceptedClientTerms &&
        hasCompletedInvestorProfileIdentification
      ) {
        setShowTermsModal("client_terms");
      }
    }
  }, [user, hasCompletedInvestorProfileIdentification]);

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
    doLogoutUser(undefined, {
      onSuccess: () => {
        updateUser(null);
        navigateModule("authentication", constants.clientAuthenticationRoutes.login);
      },
    });
  };

  const state = {
    user,
    onAcceptClientTerms,
    onRejectClientTerms,

    showTermsModal,
    termsDocumentURL,
  };

  return <CustodyWrapperContext.Provider value={state}>{children}</CustodyWrapperContext.Provider>;
};

export const useCustodyWrapperContext = () => useContext(CustodyWrapperContext);
