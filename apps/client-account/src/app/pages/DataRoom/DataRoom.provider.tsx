import { createContext, PropsWithChildren, useContext, useState } from "react";

import { queryKeys } from "@emrgo-frontend/constants";
import { fetchPlatformDocument } from "@emrgo-frontend/services";
import { useQuery } from "@tanstack/react-query";

import { IDataRoomContext } from "./DataRoom.types";

const DataRoomContext = createContext<IDataRoomContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const DataRoomProvider = ({ children }: PropsWithChildren) => {
  const [showPlatformTermsModal, setShowPlatformTermsModal] = useState(false);
  const [showClientTermsModal, setShowClientTermsModal] = useState(false);

  const [clientTermsDocumentURL, setClientTermsDocumentURL] = useState("/documents/sample.pdf");
  const [platformTermsDocumentURL, setPlatformTermsDocumentURL] = useState("/documents/sample.pdf");

  useQuery([queryKeys.miscelleneous.documents.fetch], {
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

  const onViewPlatformTermsAndConditions = () => {
    setShowPlatformTermsModal(true);
  };

  const onViewClientTermsAndConditions = () => {
    setShowClientTermsModal(true);
  };

  const onViewFeeSchedule = () => {
    console.log("View fee schedule");
  };

  const onAcceptPlatformTerms = () => {
    setShowPlatformTermsModal(false);
  };

  const onDownloadPlatformTerms = () => {
    console.log("Download platform terms");
  };

  const onPrintPlatformTerms = () => {
    console.log("Print platform terms");
  };

  const onSharePlatformTerms = () => {
    console.log("Share platform terms");
  };

  const onRejectPlatformTerms = () => {
    console.log("Reject platform terms");
    setShowPlatformTermsModal(false);
  };

  const onAcceptClientTerms = () => {
    setShowClientTermsModal(false);
  };

  const onDownloadClientTerms = () => {
    console.log("Download client terms");
  };

  const onPrintClientTerms = () => {
    console.log("Print client terms");
  };

  const onShareClientTerms = () => {
    console.log("Share client terms");
  };

  const onRejectClientTerms = () => {
    console.log("Reject client terms");
    setShowClientTermsModal(false);
  };

  const state: IDataRoomContext = {
    onViewPlatformTermsAndConditions,
    onViewClientTermsAndConditions,
    onViewFeeSchedule,
    showPlatformTermsModal,
    onAcceptPlatformTerms,
    onRejectPlatformTerms,
    showClientTermsModal,
    onAcceptClientTerms,
    onRejectClientTerms,
    clientTermsDocumentURL,
    platformTermsDocumentURL,
  };

  return <DataRoomContext.Provider value={state}>{children}</DataRoomContext.Provider>;
};

export const useDataRoomContext = () => useContext(DataRoomContext);
