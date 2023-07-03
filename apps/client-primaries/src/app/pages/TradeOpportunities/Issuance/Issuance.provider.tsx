import { createContext, PropsWithChildren, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { clientAccountRoutes, clientPrimariesRoutes, queryKeys } from "@emrgo-frontend/constants";
import { navigateModule } from "@emrgo-frontend/utils";
// import { useUser } from "@emrgo-frontend/shared-ui";
import { useQuery } from "@tanstack/react-query";

import documentsData from "./data/documents";
import { fetchIssuance } from "./Issuance.service";
import { IIssuanceContext } from "./Issuance.types";

const NUMBER_OF_PREVIEW_DOCUMENTS = 6;

const IssuanceContext = createContext<IIssuanceContext | null>(null);

const documents = documentsData.slice(0, NUMBER_OF_PREVIEW_DOCUMENTS);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const IssuanceProvider = ({ children }: PropsWithChildren) => {
  const { issuanceId } = useParams();
  const navigate = useNavigate();
  // const { user } = useUser();

  const { data: issuance } = useQuery({
    queryKey: [queryKeys.primaries.tradeOpportunities.bank.issuances.details, issuanceId],
    queryFn: () => fetchIssuance(issuanceId || ""),
  });

  const documents = issuance?.documents || [];

  const visibleDocuments = documents.slice(0, NUMBER_OF_PREVIEW_DOCUMENTS);

  const toggleIssuanceOnWatchlist = () => {
    // setIsWatched((isWatched) => !isWatched);
  };

  const addToCalendar = () => {
    console.log("Add to calendar");
  };

  const contactRM = () => {
    console.log("Contact your RM");
  };

  const handleTradeExecutionClick = (type: string) => {
    switch (type) {
      case "kyc":
        navigateModule("account", clientAccountRoutes.kyc.home);
        break;
      case "profile":
        navigateModule("account", clientAccountRoutes.clientInvestmentProfile.home);
        break;
      case "execute":
        navigate(clientPrimariesRoutes.tradeManagement.home);
        break;
      default:
        break;
    }
  };

  const state: IIssuanceContext = {
    issuance,
    documents: visibleDocuments,
    totalNumberOfDocuments: documents.length,
    toggleIssuanceOnWatchlist,
    addToCalendar,
    contactRM,
    handleTradeExecutionClick,
  };

  return <IssuanceContext.Provider value={state}>{children}</IssuanceContext.Provider>;
};

export const useIssuanceContext = () => useContext(IssuanceContext);
