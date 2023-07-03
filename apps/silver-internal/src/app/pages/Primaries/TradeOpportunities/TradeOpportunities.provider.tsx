import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";

import banks from "./data/banks";
import issuances from "./data/issuances";
import slides from "./data/slides";
import {
  IOpportunityIssuance,
  ITradeOpportunitiesContext,
  TFilterStatus,
  TFilterType,
} from "./TradeOpportunities.types";
import { useWatchlist } from "./useWatchlist";

const issuanceMatchesSearchQuery = (issuance: IOpportunityIssuance, query: string) => {
  return Object.values(issuance).some((value) => String(value).toLowerCase().includes(query));
};

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

  const filteredIssuances = useMemo(() => {
    return issuances
      .filter((issuance) => issuanceMatchesSearchQuery(issuance, searchQuery))
      .filter(({ type }) => filterType === "all-types" || type === filterType)
      .filter(({ status }) => filterStatus === "all-statuses" || status === filterStatus);
  }, [searchQuery, filterType, filterStatus]);

  // TODO: For this example purposes the implementation relies on data with values
  // already formatted specifically for presentation. When integrating, make sure
  // to format the system data accordingly.
  const data = useMemo(() => {
    return banks.map((bank) => {
      const issuances = filteredIssuances
        .filter((issuance) => issuance.bank === bank.id)
        .map((issuance) => ({
          ...issuance,
          isWatched: watchlist.includes(issuance.id),
        }));

      return { ...bank, issuances };
    });
  }, [filteredIssuances, watchlist]);

  const state: ITradeOpportunitiesContext = {
    isAboutUsDisplayed,
    setIsAboutUsDisplayed,
    slides,
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
