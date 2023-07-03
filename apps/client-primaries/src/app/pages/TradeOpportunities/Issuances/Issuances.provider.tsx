import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { clientPrimariesRoutes, queryKeys } from "@emrgo-frontend/constants";
import { toggleWatchlistItem, useFetchDropdowns } from "@emrgo-frontend/services";
import { IIssuance } from "@emrgo-frontend/types";
import { addAllDropdownRow } from "@emrgo-frontend/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reverse } from "named-urls";

import { fetchOpportunities } from "../TradeOpportunities.services";
import { TFilterStatus, TFilterType } from "../TradeOpportunities.types";
import { IIssuancesContext } from "./Issuances.types";

const IssuancesContext = createContext<IIssuancesContext | null>(null);

/**
 * @description
 * @param {PropsWithChildren} { children }
 * @returns {JSX.Element}
 */
export const IssuancesProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const { bankId } = useParams();
  const navigate = useNavigate();
  const { mutate: doToggleWatchlistItem } = useMutation(toggleWatchlistItem);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<TFilterType>("");
  const [filterStatus, setFilterStatus] = useState<TFilterStatus>("");

  const { data: investmentBanks } = useQuery({
    queryKey: [queryKeys.primaries.tradeOpportunities.fetch],
    queryFn: () => fetchOpportunities(),
    placeholderData: [],
  });

  const filteredInvestmentBank = investmentBanks?.find((bank) => bank?.bankId === bankId);

  const { data: dropdowns } = useFetchDropdowns({ types: ["productStatus", "productType"] });

  const productTypes = addAllDropdownRow({
    dropdown: dropdowns?.productType || [],
    label: "All Types",
  });

  const productStatus = addAllDropdownRow({
    dropdown: dropdowns?.productStatus || [],
    label: "All Statuses",
  });

  const goToIssuanceDetails = (issuance: IIssuance, bankId: string) => {
    // navigate(`${bankId}/issuances/${issuance.id}`);
    const route = reverse(clientPrimariesRoutes.tradeOpportunities.bank.issuances.details.home, {
      bankId,
      issuanceId: issuance.id,
    });
    navigate(route);
  };

  const downloadData = () => {
    console.log("Download data");
  };

  const toggleWatchlist = (id: string) => {
    const opportunities: IIssuance[] = [];
    investmentBanks?.forEach((bank) => {
      bank.opportunities.forEach((opportuntity: IIssuance) => {
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

  const selectProductType = (type: TFilterType) => {
    setFilterType(type);
  };

  const selectProductStatus = (status: TFilterStatus) => {
    console.log(
      "🚀 ~ file: TradeOpportunities.provider.tsx:68 ~ selectProductType ~ status:",
      status
    );
  };

  const state: IIssuancesContext = {
    data: filteredInvestmentBank,
    toggleIssuanceOnWatchlist: toggleWatchlist,
    goToIssuanceDetails,
    downloadData,
    searchQuery,
    setSearchQuery,
    filterType,
    selectProductType,
    filterStatus,
    selectProductStatus,
    productTypes,
    productStatus,
  };

  return <IssuancesContext.Provider value={state}>{children}</IssuancesContext.Provider>;
};

export const useIssuancesContext = () => useContext(IssuancesContext);
