import { FC } from "react";

import { accountIdentification } from "@emrgo-frontend/constants";
import {
  Button,
  DashboardContent,
  DashboardTemporaryTooltipContent,
  Drawer,
  InfoIcon,
  Panel,
  PanelContent,
  PanelHeader,
  PanelHeaderIcon,
  PanelHeaderTitle,
  PanelOverlay,
  Tooltip,
  useUser,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { ExecutedTable } from "./ExecutedTable";
import { PendingExecutionTable } from "./PendingExecutionTable";
import { PurchaseTicket } from "./PurchaseTicket";
import { useTradeManagementContext } from "./TradeManagement.provider";
import { ITradeManagementProps } from "./TradeManagement.types";
import { WatchlistTable } from "./WatchlistTable";

export const TradeManagementComponent: FC<ITradeManagementProps> = (
  props: ITradeManagementProps
) => {
  const { handleCompleteIdentificationClick, purchaseTicket } = ensureNotNull(
    useTradeManagementContext()
  );

  const { user } = useUser();

  let isSectionEnabled = true;
  let buttonText = "";
  let type = "";

  if (
    user?.clientKycStatus === accountIdentification.KYC_STATUS_APPROVED &&
    user?.entityKycStatus !== accountIdentification.KYC_STATUS_APPROVED
  ) {
    // Completed investor profile but not KYC
    type = "kyc";
    isSectionEnabled = false;
    buttonText = "Complete KYC to trade";
  }

  if (
    user?.clientKycStatus !== accountIdentification.KYC_STATUS_APPROVED &&
    user?.entityKycStatus !== accountIdentification.KYC_STATUS_APPROVED
  ) {
    // Completed neither investor profile nor KYC
    type = "profile";
    isSectionEnabled = false;
    buttonText = "Complete profile & KYC to trade";
  }

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

            {!isSectionEnabled && (
              <PanelOverlay>
                <Button size="large" onClick={() => handleCompleteIdentificationClick(type)}>
                  {buttonText}
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

            {!isSectionEnabled && (
              <PanelOverlay>
                <Button size="large" onClick={() => handleCompleteIdentificationClick(type)}>
                  {buttonText}
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
