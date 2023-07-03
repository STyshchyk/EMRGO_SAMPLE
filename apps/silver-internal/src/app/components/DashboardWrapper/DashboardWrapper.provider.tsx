import { createContext, PropsWithChildren, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";

import { useToast } from "@emrgo-frontend/shared-ui";
import { useMutation } from "@tanstack/react-query";
import { useDarkMode } from "usehooks-ts";

import { logoutUser } from "../../pages/Authentication/Login/Login.services";
import { useUserStore } from "../../pages/Authentication/store";
import { acceptClientTerms, docTypes, getPlatformDocument, viewFile } from "../../services";
import { IDashboardWrapperContext } from "./DashboardWrapper.types";

const DashboardWrapperContext = createContext<IDashboardWrapperContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the DashboardWrapper template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const DashboardWrapperProvider = ({ children }: PropsWithChildren) => {

  const user = useUserStore(state => state.user);
  const removeUser = useUserStore(state => state.removeUser);
  const [clientTermsDocumentURL, setClientTermsDocumentURL] = useState("");
  const [showClientTermsModal, setShowClientTermsModal] = useState(!user?.hasAcceptedClientTerms);
  const { mutate: doAcceptClientTerms } = useMutation(acceptClientTerms);
  const [showMFAModal, setShowMFAModal] = useState(true);
  const { disable } = useDarkMode();
  const [copyState, copyToClipboard] = useCopyToClipboard();
  const { mutate: doLogoutUser } = useMutation(logoutUser);
  const { showSuccessToast, showErrorToast } = useToast();
  useLayoutEffect(() => {
    disable();
  }, []);

  const { mutate: doGetPlatformDocument } = useMutation(getPlatformDocument);
  const { mutate: doViewFile } = useMutation(viewFile, {
    onSuccess: (res) => {
      setClientTermsDocumentURL(res.url);
    }
  });
  useEffect(() => {
    doGetPlatformDocument({ documentType: docTypes.tnc }, {
      onSuccess: (res) => {
        doViewFile(res.path);
      }
    });
  }, []);
  const onAcceptTerms = () => {
    setShowClientTermsModal(false);
    doAcceptClientTerms(undefined, {
      onSuccess: () => {
        setShowClientTermsModal(false);
      }
    });
  };
  const onSetMFA = () => {
    setShowMFAModal(true);
  };
  const onDownloadTerms = () => {
    // TODO: Implement this code.
    const link = document.createElement("a");
    link.href = clientTermsDocumentURL;
    link.target = "_blank";
    link.download = "emrgo-client-terms.pdf";
    link.click();
    // Suggest trriggering a download by appending a link to the DOM and clicking it.
  };

  const onPrintTerms = () => {
    // TODO: Implement this code.
    window.open(clientTermsDocumentURL, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=768,height=920");
    const newWindow = window.open(clientTermsDocumentURL, "");
    if (newWindow) {
      newWindow.onload = () => {
        newWindow?.print();
      };
    }
  };

  const onShareTerms = () => {
    // TODO: Implement this code.
    const text = `Hey, check out the client-terms on the Emrgo platform. ${clientTermsDocumentURL}`;
    copyToClipboard(text);
    if (copyState.error) {
      showErrorToast("An error occurred while copying to clipboard");
    } else {
      showSuccessToast("Successfully copied to clipboard");
    }
  };

  const onRejectTerms = () => {
    // TODO: Implement this code.
    doLogoutUser(undefined, {
      onSuccess: () => {
        removeUser();
      }
    });

  };

  const state: IDashboardWrapperContext = {
    showClientTermsModal,
    onAcceptTerms,
    onDownloadTerms,
    onPrintTerms,
    onShareTerms,
    onRejectTerms,
    numberOfNotifications: 1
  };

  return (
    <DashboardWrapperContext.Provider value={state}>{children}</DashboardWrapperContext.Provider>
  );
};

export const useDashboardWrapperContext = () => useContext(DashboardWrapperContext);
