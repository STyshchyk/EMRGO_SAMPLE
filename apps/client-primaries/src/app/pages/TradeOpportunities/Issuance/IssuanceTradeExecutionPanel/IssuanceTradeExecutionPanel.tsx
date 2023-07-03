import { FC } from "react";

import { accountIdentification } from "@emrgo-frontend/constants";
import {
  Button,
  Panel,
  PanelContent,
  PanelFooter,
  PanelHeader,
  PanelHeaderTitle,
  useUser,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { useIssuanceContext } from "../Issuance.provider";
import { PanelText } from "../PanelText";
import { IIssuanceTradeExecutionPanelProps } from "./IssuanceTradeExecutionPanel.types";

export const IssuanceTradeExecutionPanel: FC<IIssuanceTradeExecutionPanelProps> = (props) => {
  const { handleTradeExecutionClick } = ensureNotNull(useIssuanceContext());

  const { user } = useUser();

  let type = "";
  let buttonText = "";
  let panelText = "";

  if (
    user?.clientKycStatus === accountIdentification.KYC_STATUS_APPROVED &&
    user?.entityKycStatus === accountIdentification.KYC_STATUS_APPROVED
  ) {
    // Completed both investor profile and KYC
    type = "execute";
    buttonText = "Go to Trade Management";
    panelText = "";
  }

  if (
    user?.clientKycStatus === accountIdentification.KYC_STATUS_APPROVED &&
    user?.entityKycStatus !== accountIdentification.KYC_STATUS_APPROVED
  ) {
    // Completed investor profile but not KYC
    type = "kyc";
    buttonText = "Complete KYC to trade";
    panelText = "You can execute trades here. Complete your KYC to trade.";
  }

  if (
    user?.clientKycStatus !== accountIdentification.KYC_STATUS_APPROVED &&
    user?.entityKycStatus !== accountIdentification.KYC_STATUS_APPROVED
  ) {
    // Completed neither investor profile nor KYC
    type = "profile";
    buttonText = "Complete profile & KYC to trade";
    panelText = "You can execute trades here. Complete your profile and KYC to trade.";
  }

  return (
    <Panel>
      <PanelHeader>
        <PanelHeaderTitle>Trade execution</PanelHeaderTitle>
      </PanelHeader>
      <PanelContent>
        <PanelText>{panelText}</PanelText>
      </PanelContent>
      <PanelFooter>
        <Button onClick={() => handleTradeExecutionClick(type)}>{buttonText}</Button>
      </PanelFooter>
    </Panel>
  );
};
