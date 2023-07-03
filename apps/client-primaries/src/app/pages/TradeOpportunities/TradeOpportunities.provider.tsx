import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { clientPrimariesRoutes, queryKeys } from "@emrgo-frontend/constants";
import { toggleWatchlistItem, useFetchDropdowns } from "@emrgo-frontend/services";
import { IIssuance, IOption } from "@emrgo-frontend/types";
import { addAllDropdownRow, normaliseDropdownValues } from "@emrgo-frontend/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reverse } from "named-urls";

import slides from "./data/slides";
import { fetchOpportunities } from "./TradeOpportunities.services";
import { ITradeOpportunitiesContext } from "./TradeOpportunities.types";

const TradeOpportunitiesContext = createContext<ITradeOpportunitiesContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const TradeOpportunitiesProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const [isAboutUsDisplayed, setIsAboutUsDisplayed] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<IOption | null>(null);
  const [filterStatus, setFilterStatus] = useState<IOption | null>(null);

  const navigate = useNavigate();
  const { mutate: doToggleWatchlistItem } = useMutation(toggleWatchlistItem);

  const { data: investmentBanks } = useQuery({
    queryKey: [queryKeys.primaries.tradeOpportunities.fetch, filterType, filterStatus],
    queryFn: () => fetchOpportunities(filterType, filterStatus),
    placeholderData: [],
  });

  const { data: dropdowns } = useFetchDropdowns({ types: ["productStatus", "productType"] });

  const productTypes = addAllDropdownRow({
    dropdown: dropdowns?.productType || [],
    label: "All Types",
  });

  const productStatus = useMemo(
    () =>
      addAllDropdownRow({
        dropdown: dropdowns?.productStatus || [],
        label: "All Statuses",
      }),
    [dropdowns]
  );

  // const productStatus = ;

  const downloadData = () => {
    console.log("Download data");
  };

  const goToIssuanceDetails = (issuance: IIssuance, bankId: string) => {
    const route = reverse(clientPrimariesRoutes.tradeOpportunities.bank.issuances.details.home, {
      bankId,
      issuanceId: issuance.id,
    });
    navigate(route);
  };

  const selectProductType = (type: IOption) => {
    setFilterType(type);
  };

  const selectProductStatus = (status: IOption) => {
    setFilterStatus(status);
  };

  const toggleWatchlist = (id: string) => {
    const opportunities: IIssuance[] = [];
    investmentBanks?.forEach((bank) => {
      bank?.opportunities?.forEach((opportuntity: IIssuance) => {
        opportunities.push(opportuntity);
      });
    });

    const foundOpportunity = opportunities.find((opportuntity) => opportuntity.id === id);

    if (foundOpportunity) {
      const requestPayload = {
        action: foundOpportunity.isWatched ? "remove" : "add",
        opportunityId: id,
      };

      doToggleWatchlistItem(requestPayload, {
        onSuccess: (response) => {
          queryClient.invalidateQueries({
            queryKey: [queryKeys.primaries.tradeOpportunities.fetch],
            exact: true,
          });
        },
      });
    }
  };

  const normalisedProductStatusOptions = normaliseDropdownValues({
    dropdown: productStatus || [],
    labelKey: "label",
    valueKey: "id",
  });

  const normalisedProductTypesOptions = normaliseDropdownValues({
    dropdown: productTypes || [],
    labelKey: "label",
    valueKey: "id",
  });

  const state: ITradeOpportunitiesContext = {
    isAboutUsDisplayed,
    setIsAboutUsDisplayed,
    slides,
    downloadData,
    investmentBanks,
    toggleIssuanceOnWatchlist: toggleWatchlist,
    searchQuery,
    setSearchQuery,
    filterType,
    selectProductType,
    filterStatus,
    selectProductStatus,
    goToIssuanceDetails,
    productTypes: normalisedProductTypesOptions,
    productStatus: normalisedProductStatusOptions,
  };

  return (
    <TradeOpportunitiesContext.Provider value={state}>
      {children}
    </TradeOpportunitiesContext.Provider>
  );
};

export const useTradeOpportunitiesContext = () => useContext(TradeOpportunitiesContext);
