import { FC } from "react";

import {
  Button,
  Panel,
  PanelContent,
  PanelFooter,
  PanelHeader,
  PanelHeaderTitle,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { useIssuanceContext } from "../Issuance.provider";
import { PanelText } from "../PanelText";
import { IIssuanceLearnMorePanelProps } from "./IssuanceLearnMorePanel.types";

export const IssuanceLearnMorePanel: FC<IIssuanceLearnMorePanelProps> = ({}) => {
  const { contactRM } = ensureNotNull(useIssuanceContext());

  return (
    <Panel>
      <PanelHeader>
        <PanelHeaderTitle>Learn more about the opportunity</PanelHeaderTitle>
      </PanelHeader>
      <PanelContent>
        <PanelText>
          Your Relationship Manager is available to tell you more about this Opportunity
        </PanelText>
      </PanelContent>
      <PanelFooter>
        <Button onClick={contactRM}>Contact your RM</Button>
      </PanelFooter>
    </Panel>
  );
};
