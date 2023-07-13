import React, { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { getOppotunities } from "@emrgo-frontend/services";
import { useQuery } from "@tanstack/react-query";

import { useWatchlist } from "../useWatchlist";
import { IIssuancesContext } from "./Issuances.types";

const IssuancesContext = createContext<IIssuancesContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 * Integration point for the IvitedUsers template. Put any integration logic here.
 * For example, if you need to fetch data from an API, you can do that here.
 *
 * TODO: Implement this code.
 */
export const IssuancesProvider = ({ children }: PropsWithChildren) => {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const { watchlist, toggleOnWatchlist } = useWatchlist();
  const {
    data: opportunitiesData,
    isError,
    isFetched
  } = useQuery({
    queryFn: getOppotunities,
    queryKey: [queryKeys.primaries.tradeOpportunities.fetch],
    onSuccess: () => {
      setLoading(prevState => prevState = !prevState);
    }
  });
  const data = useMemo(() => {
    if (!opportunitiesData) return null;
    const bank = opportunitiesData.find((bank: any) => {
        return String(bank.bankId) === id;
      }
    );
    if (!bank) {
      return;
    }
    // TODO: remove this after delete API is ready
    const bankOpportunities = bank.opportunities.filter((oppor: any) => {
      // eslint-disable-next-line no-prototype-builtins
      return oppor.hasOwnProperty("return");
    });
    return {
      ...bank,
      opportunities: bankOpportunities
    };
  }, [id, loading]);
  const state: IIssuancesContext = {
    data,
    toggleIssuanceOnWatchlist: toggleOnWatchlist
  };

  return <IssuancesContext.Provider value={state}>{children}</IssuancesContext.Provider>;
};

export const useIssuancesContext = () => useContext(IssuancesContext);
