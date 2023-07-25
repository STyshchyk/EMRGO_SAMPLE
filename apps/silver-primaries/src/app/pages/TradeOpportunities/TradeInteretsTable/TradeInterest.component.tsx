import { FC } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  silverQueryKeys as queryKeys,
  silverPrimariesRoutes as routes,
  silverQueryKeys,
} from "@emrgo-frontend/constants";
import { getTradeInterests } from "@emrgo-frontend/services";
import {
  BreadcrumbLink,
  Breadcrumbs,
  Button,
  DashboardContent,
  Modal,
  Panel,
  PanelContent,
  PanelHeader,
  useToast,
} from "@emrgo-frontend/shared-ui";
import { useQuery } from "@tanstack/react-query";
import { reverse } from "named-urls";

import { useAddSellsideStore, useSellSideStore, useTradeInterestModal } from "../../store/store";
import { TradeInterestTable } from "./TradeInterestTable";
import { ITradeInterestComponent } from "./TradeInterestTable.types";

export const TradeInterestComponent: FC<
  ITradeInterestComponent
> = ({}: ITradeInterestComponent) => {
  const navigate = useNavigate();
  const { isModalOpen, modalActions } = useAddSellsideStore();
  const { showErrorToast } = useToast();
  const { opportunityId } = useParams();
  const { opportunityData } = useTradeInterestModal();
  const { data } = useQuery({
    staleTime: 0,
    cacheTime: 0,
    queryFn: async () => {
      const data = await getTradeInterests(opportunityData?.id ?? opportunityId);
      return await (
        await data
      ).data.data;
    },
    queryKey: [
      reverse(silverQueryKeys.primaries.tradeOpportunities.tradeInterest.fetch, {
        tradeInterests: `${opportunityData?.id}`,
      }),
    ],
  });
  console.log(
    reverse(silverQueryKeys.primaries.tradeOpportunities.tradeInterest.fetch, {
      tradeInterests: `${opportunityData?.id}`,
    })
  );
  return (
    <DashboardContent>
      <Breadcrumbs>
        <BreadcrumbLink as={Link} to={routes.primaries.tradeOpportunity.home}>
          Trade opportunities
        </BreadcrumbLink>
        <BreadcrumbLink isCurrent>{`Trade Interests ${opportunityId}`}</BreadcrumbLink>
      </Breadcrumbs>
      <Panel>
        <PanelHeader>Trade interests</PanelHeader>
        <PanelContent>{data && <TradeInterestTable tradeInterest={data} />}</PanelContent>
      </Panel>
    </DashboardContent>
  );
};
