import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useCopyToClipboard } from "react-use";

import * as constants from "@emrgo-frontend/constants";
import { fetchPlatformDocument, fetchUserProfile, logoutUser } from "@emrgo-frontend/services";
import { useToast, useUser } from "@emrgo-frontend/shared-ui";
import { navigateModule } from "@emrgo-frontend/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { acceptClientTerms } from "./PrimariesWrapper.services";
import { IPrimariesWrapperContext } from "./PrimariesWrapper.types";

const PrimariesWrapperContext = createContext<IPrimariesWrapperContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const PrimariesWrapperProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const { updateUser } = useUser();
  const { mutate: doLogoutUser } = useMutation(logoutUser);
  const { mutate: doAcceptClientTerms } = useMutation(acceptClientTerms);
  const [clientTermsDocumentURL, setClientTermsDocumentURL] = useState("/documents/sample.pdf");
  const [showClientTermsModal, setShowClientTermsModal] = useState(false);
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const { showSuccessToast, showErrorToast } = useToast();

  useQuery([constants.queryKeys.miscelleneous.documents.fetch], {
    staleTime: 60 * 60,
    queryFn: () => fetchPlatformDocument({ documentType: "client_terms" }),
    onSuccess: (response) => {
      // console.log(
      //   "🚀 ~ file: PrimariesWrapper.provider.tsx:34 ~ PrimariesWrapperProvider ~ response:",
      //   response
      // );
      // setClientTermsDocumentURL("");
    },
  });

  useQuery([constants.queryKeys.account.profile.fetch], {
    queryFn: () => fetchUserProfile(),
    onSuccess: (response) => {
      const user = response;
      updateUser(user);
      setShowClientTermsModal(!user?.hasAcceptedClientTerms || false);
      // setShowClientTermsModal(true);
    },
  });

  const onAcceptTerms = () => {
    doAcceptClientTerms(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [constants.queryKeys.account.profile.fetch],
          exact: true,
        });
        setShowClientTermsModal(false);
      },
    });
  };

  const onDownloadTerms = () => {
    // Suggest trriggering a download by appending a link to the DOM and clicking it.
    const link = document.createElement("a");
    link.href = clientTermsDocumentURL;
    link.target = "_blank";
    link.download = "emrgo-client-terms.pdf";
    link.click();
  };

  const onPrintTerms = () => {
    // TODO: Implement this code.
    window.open(clientTermsDocumentURL, "PRINT", "height=400,width=600");
    const newWindow = window.open(clientTermsDocumentURL, "_blank");
    if (newWindow) {
      newWindow.onload = () => {
        newWindow?.print();
      };
    }
  };

  const onShareTerms = () => {
    const text = `Hey, check out the client-terms on the Emrgo platform. ${clientTermsDocumentURL}`;

    copyToClipboard(text);

    if (copyState.error) {
      showErrorToast("An error occured when copying to clipboard");
    } else {
      showSuccessToast("Copied to clipboard");
    }
  };

  const onRejectTerms = () => {
    doLogoutUser(null, {
      onSuccess: () => {
        updateUser(null);
        navigateModule("authentication", constants.clientAuthenticationRoutes.login);
      },
    });
  };

  const state: IPrimariesWrapperContext = {
    numberOfNewTradeOpportunities: 1,
    showClientTermsModal,
    clientTermsDocumentURL,
    onAcceptTerms,
    onDownloadTerms,
    onPrintTerms,
    onShareTerms,
    onRejectTerms,
    numberOfNotifications: 1,
  };

  return (
    <PrimariesWrapperContext.Provider value={state}>{children}</PrimariesWrapperContext.Provider>
  );
};

export const usePrimariesWrapperContext = () => useContext(PrimariesWrapperContext);
