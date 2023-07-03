import { createContext, PropsWithChildren, useContext } from "react";
import { useParams } from "react-router-dom";

import { queryKeys } from "@emrgo-frontend/constants";
import { useQuery } from "@tanstack/react-query";

import { fetchIssuance, fetchIssuanceDocuments } from "../Issuance/Issuance.service";
import { IIssuanceDataRoomContext } from "./IssuanceDataRoom.types";

const IssuanceDataRoomContext = createContext<IIssuanceDataRoomContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const IssuanceDataRoomProvider = ({ children }: PropsWithChildren) => {
  const { bankId, issuanceId } = useParams();

  const { data: issuance } = useQuery({
    queryKey: [queryKeys.primaries.tradeOpportunities.bank.issuances.details, issuanceId],
    queryFn: () => fetchIssuance(issuanceId || ""),
  });

  const state: IIssuanceDataRoomContext = { issuance };

  return (
    <IssuanceDataRoomContext.Provider value={state}>{children}</IssuanceDataRoomContext.Provider>
  );
};

export const useIssuanceDataRoomContext = () => useContext(IssuanceDataRoomContext);
