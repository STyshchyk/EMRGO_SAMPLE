import { createContext, PropsWithChildren, useContext, useState } from "react";

import executed from "./data/executed";
import pendingExecution from "./data/pending-execution";
import purchaseTicketData from "./data/purchase-ticket";
import watchlist from "./data/watchlist";
import { IPurchaseTicket, ITradeManagementContext } from "./TradeManagement.types";

const TradeManagementContext = createContext<ITradeManagementContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the TradeManagement template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const TradeManagementProvider = ({ children }: PropsWithChildren) => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [purchaseTicket, setPurchaseTicket] = useState<IPurchaseTicket | undefined>();

  const removeFromWatchlist = (id: number) => {
    console.log("Remove from watchlist", id);
  };

  const viewTicket = () => {
    setPurchaseTicket(purchaseTicketData);
  };

  const proceed = (id: number) => {
    console.log("Proceed", id);
  };

  const rejectPurchaseTicket = (id: number) => {
    console.log("Reject purchase ticket", id);
  };

  const executePurchaseTicket = (id: number) => {
    console.log("Execute purchase ticket", id);
  };

  const state: ITradeManagementContext = {
    executed,
    pendingExecution,
    watchlist,
    removeFromWatchlist,
    viewTicket,
    proceed,
    isProfileComplete,
    setIsProfileComplete,
    purchaseTicket,
    setPurchaseTicket,
    rejectPurchaseTicket,
    executePurchaseTicket,
  };

  return (
    <TradeManagementContext.Provider value={state}>{children}</TradeManagementContext.Provider>
  );
};

export const useTradeManagementContext = () => useContext(TradeManagementContext);
