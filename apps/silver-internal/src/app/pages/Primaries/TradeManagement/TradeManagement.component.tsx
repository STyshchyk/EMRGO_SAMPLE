import { FC } from "react";

import {
  Button,
  InfoIcon,
  Panel,
  PanelContent,
  PanelHeader,
  PanelHeaderIcon,
  PanelHeaderTitle,
  PanelOverlay,
  Tooltip,
  Drawer
} from "@emrgo-frontend/shared-ui";
import { DashboardContent } from "@emrgo-frontend/shared-ui";
import { DashboardTemporaryTooltipContent } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { ExecutedTable } from "./ExecutedTable";
import { PendingExecutionTable } from "./PendingExecutionTable";
import { PurchaseTicket } from "./PurchaseTicket";
import { useTradeManagementContext } from "./TradeManagement.provider";
import { ITradeManagementProps } from "./TradeManagement.types";
import { WatchlistTable } from "./WatchlistTable";

export const TradeManagementComponent: FC<ITradeManagementProps> = ({}: ITradeManagementProps) => {
  const { isProfileComplete, setIsProfileComplete, purchaseTicket } = ensureNotNull(
    useTradeManagementContext()
  );

  return (
    <>
      <DashboardContent>
        <Panel>
          <PanelHeader>
            <PanelHeaderTitle>Watchlist</PanelHeaderTitle>

            <Tooltip content={<DashboardTemporaryTooltipContent />}>
              <PanelHeaderIcon>
                <InfoIcon />
              </PanelHeaderIcon>
            </Tooltip>
          </PanelHeader>
          <PanelContent>
            <WatchlistTable />
          </PanelContent>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelHeaderTitle>Pending Execution</PanelHeaderTitle>

            <Tooltip content={<DashboardTemporaryTooltipContent />}>
              <PanelHeaderIcon>
                <InfoIcon />
              </PanelHeaderIcon>
            </Tooltip>
          </PanelHeader>
          <PanelContent>
            <PendingExecutionTable />

            {!isProfileComplete && (
              <PanelOverlay>
                <Button size="large" onClick={() => setIsProfileComplete(true)}>
                  Complete profile & KYC to view data
                </Button>
              </PanelOverlay>
            )}
          </PanelContent>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelHeaderTitle>Executed</PanelHeaderTitle>

            <Tooltip content={<DashboardTemporaryTooltipContent />}>
              <PanelHeaderIcon>
                <InfoIcon />
              </PanelHeaderIcon>
            </Tooltip>
          </PanelHeader>
          <PanelContent>
            <ExecutedTable />

            {!isProfileComplete && (
              <PanelOverlay>
                <Button size="large" onClick={() => setIsProfileComplete(true)}>
                  Complete profile & KYC to view data
                </Button>
              </PanelOverlay>
            )}
          </PanelContent>
        </Panel>
      </DashboardContent>

      <Drawer isOpen={Boolean(purchaseTicket)}>
        <PurchaseTicket />
      </Drawer>
    </>
  );
};
