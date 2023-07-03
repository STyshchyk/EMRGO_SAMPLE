import { createContext, PropsWithChildren, useContext, useState } from "react";

import { clientAccountRoutes } from "@emrgo-frontend/constants";
import { navigateModule } from "@emrgo-frontend/utils";

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
 */
export const TradeManagementProvider = ({ children }: PropsWithChildren) => {
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

  const handleCompleteIdentificationClick = (type: string) => {
    switch (type) {
      case "kyc":
        navigateModule("account", clientAccountRoutes.kyc.home);
        break;
      case "profile":
        navigateModule("account", clientAccountRoutes.clientInvestmentProfile.home);
        break;
      default:
        break;
    }
  };

  const state: ITradeManagementContext = {
    executed,
    pendingExecution,
    watchlist,
    removeFromWatchlist,
    viewTicket,
    proceed,
    purchaseTicket,
    setPurchaseTicket,
    rejectPurchaseTicket,
    executePurchaseTicket,
    handleCompleteIdentificationClick,
  };

  return (
    <TradeManagementContext.Provider value={state}>{children}</TradeManagementContext.Provider>
  );
};

export const useTradeManagementContext = () => useContext(TradeManagementContext);
