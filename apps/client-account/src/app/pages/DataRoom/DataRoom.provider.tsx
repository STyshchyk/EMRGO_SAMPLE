import { createContext, PropsWithChildren, useContext, useState } from "react";

import { queryKeys } from "@emrgo-frontend/constants";
import {
  acceptClientTerms,
  acceptPlatformTerms,
  fetchDocumentLink,
  fetchDocumentPath,
} from "@emrgo-frontend/services";
import { useRefreshProfile, useToast, useUser } from "@emrgo-frontend/shared-ui";
import { useMutation, useQuery } from "@tanstack/react-query";

import { IDataRoomContext } from "./DataRoom.types";

const DataRoomContext = createContext<IDataRoomContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const DataRoomProvider = ({ children }: PropsWithChildren) => {
  const { user } = useUser();
  const { showSuccessToast } = useToast();
  const refreshProfile = useRefreshProfile();
  const [showTermsModal, setShowTermsModal] = useState("");
  const [termsDocumentURL, setTermsDocumentURL] = useState("");

  const { mutate: doAcceptClientTerms } = useMutation(acceptClientTerms);
  const { mutate: doAcceptPlatformTerms } = useMutation(acceptPlatformTerms);

  const { data: documentDetails } = useQuery(
    [queryKeys.miscelleneous.documents.fetchPath, showTermsModal],
    {
      staleTime: 60 * 60,
      queryFn: () => fetchDocumentPath({ documentType: showTermsModal }),
      enabled: showTermsModal !== "",
    }
  );

  const documentPath = documentDetails?.path || "";

  useQuery([queryKeys.miscelleneous.documents.fetchLink, documentPath], {
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

  const onViewPlatformTermsAndConditions = () => {
    setShowTermsModal("tnc");
  };

  const onViewClientTermsAndConditions = () => {
    setShowTermsModal("client_terms");
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

  const onRejectPlatformTerms = () => {
    resetTermsModal();
  };

  const onAcceptClientTerms = () => {
    doAcceptClientTerms(undefined, {
      onSuccess: (response) => {
        refreshProfile();
        showSuccessToast("Successfully accepted client terms and conditions");
      },
    });
    resetTermsModal();
  };

  const onRejectClientTerms = () => {
    resetTermsModal();
  };

  const state: IDataRoomContext = {
    user,
    onViewPlatformTermsAndConditions,
    onViewClientTermsAndConditions,
    onAcceptPlatformTerms,
    onRejectPlatformTerms,
    onAcceptClientTerms,
    onRejectClientTerms,
    showTermsModal,
    termsDocumentURL,
  };

  return <DataRoomContext.Provider value={state}>{children}</DataRoomContext.Provider>;
};

export const useDataRoomContext = () => useContext(DataRoomContext);
