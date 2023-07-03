import { createContext, PropsWithChildren, useContext, useState } from "react";

import { IDataRoomContext } from "./DataRoom.types";

const DataRoomContext = createContext<IDataRoomContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the DataRoom template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const DataRoomProvider = ({ children }: PropsWithChildren) => {
  const [showPlatformTermsModal, setShowPlatformTermsModal] = useState(false);
  const [showClientTermsModal, setShowClientTermsModal] = useState(false);

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
  };

  const state: IDataRoomContext = {
    onViewPlatformTermsAndConditions,
    onViewClientTermsAndConditions,
    onViewFeeSchedule,
    showPlatformTermsModal,
    onAcceptPlatformTerms,
    onDownloadPlatformTerms,
    onPrintPlatformTerms,
    onSharePlatformTerms,
    onRejectPlatformTerms,
    showClientTermsModal,
    onAcceptClientTerms,
    onDownloadClientTerms,
    onPrintClientTerms,
    onShareClientTerms,
    onRejectClientTerms,
  };

  return <DataRoomContext.Provider value={state}>{children}</DataRoomContext.Provider>;
};

export const useDataRoomContext = () => useContext(DataRoomContext);
