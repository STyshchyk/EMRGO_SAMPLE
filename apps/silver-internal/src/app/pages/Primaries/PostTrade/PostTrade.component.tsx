import { FC } from "react";

import {
  DashboardContent,
  DashboardTemporaryTooltipContent,
  Drawer,
  InfoIcon,
  Panel,
  PanelContent,
  PanelHeader,
  PanelHeaderIcon,
  PanelHeaderTitle,
  Tooltip,
} from "@emrgo-frontend/shared-ui";

import { ensureNotNull } from "@emrgo-frontend/utils";

import { CustodyTable } from "./CustodyTable";
import { PaymentInstruction } from "./PaymentInstruction";
import { PendingSettlementTable } from "./PendingSettlementTable";
import { usePostTradeContext } from "./PostTrade.provider";
import { IPostTradeProps } from "./PostTrade.types";
import { StandardSettlementInstruction } from "./StandardSettlementInstruction";

export const PostTradeComponent: FC<IPostTradeProps> = ({}: IPostTradeProps) => {
  const { paymentInstruction, standardSettlementInstruction } = ensureNotNull(
    usePostTradeContext()
  );

  return (
    <>
      <DashboardContent>
        <Panel>
          <PanelHeader>
            <PanelHeaderTitle>Pending Settlement</PanelHeaderTitle>

            <Tooltip content={<DashboardTemporaryTooltipContent />}>
              <PanelHeaderIcon>
                <InfoIcon />
              </PanelHeaderIcon>
            </Tooltip>
          </PanelHeader>
          <PanelContent>
            <PendingSettlementTable />
          </PanelContent>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelHeaderTitle>Custody</PanelHeaderTitle>

            <Tooltip content={<DashboardTemporaryTooltipContent />}>
              <PanelHeaderIcon>
                <InfoIcon />
              </PanelHeaderIcon>
            </Tooltip>
          </PanelHeader>
          <PanelContent>
            <CustodyTable />
          </PanelContent>
        </Panel>
      </DashboardContent>

      <Drawer isOpen={Boolean(paymentInstruction)}>
        <PaymentInstruction />
      </Drawer>

      <Drawer isOpen={Boolean(standardSettlementInstruction)}>
        <StandardSettlementInstruction />
      </Drawer>
    </>
  );
};
