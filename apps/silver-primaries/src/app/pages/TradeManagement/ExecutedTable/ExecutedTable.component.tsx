import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  DashboardContent,
  Panel,
  PanelContent,
  PanelHeader,
  useToast,
} from "@emrgo-frontend/shared-ui";

import { useAddSellsideStore } from "../../store/store";
import { IExecutedTableCopmonent } from "./ExecutedTable.types";

export const ExecutedTableComponent: FC<
  IExecutedTableCopmonent
> = ({}: IExecutedTableCopmonent) => {
  const navigate = useNavigate();
  const { isModalOpen, modalActions } = useAddSellsideStore();
  const { showErrorToast } = useToast();
  const { opportunityId } = useParams();

  return (
    <Panel>
      <PanelHeader>Executed</PanelHeader>
      <PanelContent>{/*{data && <TradeInterestTable tradeInterest={data} />}*/}</PanelContent>
    </Panel>
  );
};
