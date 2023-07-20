import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";

import { ITradeOpportunitiesContext, TFilterStatus, TFilterType } from "./TradeOpportunities.types";
import { useWatchlist } from "./useWatchlist";

const TradeOpportunitiesContext = createContext<ITradeOpportunitiesContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the TradeOpportunities template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const TradeOpportunitiesProvider = ({ children }: PropsWithChildren) => {
  const [isAboutUsDisplayed, setIsAboutUsDisplayed] = useState(true);
  const { watchlist, toggleOnWatchlist } = useWatchlist();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<TFilterType>("all-types");
  const [filterStatus, setFilterStatus] = useState<TFilterStatus>("all-statuses");

  const downloadData = () => {
    console.log("Download data");
  };

  const state: ITradeOpportunitiesContext = {
    isAboutUsDisplayed,
    setIsAboutUsDisplayed,
    downloadData,
    // data,
    toggleIssuanceOnWatchlist: toggleOnWatchlist,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
  };

  return (
    <TradeOpportunitiesContext.Provider value={state}>
      {children}
    </TradeOpportunitiesContext.Provider>
  );
};

export const useTradeOpportunitiesContext = () => useContext(TradeOpportunitiesContext);
