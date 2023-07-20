import { FC } from "react";

import {
  AddToCalendarIcon,
  HyperlinkIcon,
  Panel,
  PanelContent,
  PanelHeader,
  PanelHeaderRight,
  PanelHeaderTitle,
  Properties,
  Property,
  PropertyKey,
  PropertyValue,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";

import { useIssuanceContext } from "../Issuance.provider";
import * as Styles from "./IssuanceLifecyclePanel.styles";
import { IIssuanceLifecyclePanelProps } from "./IssuanceLifecyclePanel.types";

export const IssuanceLifecyclePanel: FC<IIssuanceLifecyclePanelProps> = ({}) => {
  const { addToCalendar, issuance } = ensureNotNull(useIssuanceContext());

  if (!issuance) {
    return null;
  }

  return (
    <Panel>
      <PanelHeader>
        <PanelHeaderTitle>Lifecycle</PanelHeaderTitle>

        <PanelHeaderRight>
          <Styles.AddToCalendarLink as="button" onClick={addToCalendar}>
            <HyperlinkIcon>
              <AddToCalendarIcon />
            </HyperlinkIcon>
            Add to calendar
          </Styles.AddToCalendarLink>
        </PanelHeaderRight>
      </PanelHeader>
      <PanelContent>
        <Properties>
          <Property>
            <PropertyKey>Pre-Offer Period ends</PropertyKey>
            <PropertyValue>{issuance.preOfferPeriodEnd}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Offer Period ends</PropertyKey>
            <PropertyValue>{issuance.offerPeriodEnd}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Issue Date</PropertyKey>
            <PropertyValue>{issuance.issueDate}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Redemption Date</PropertyKey>
            <PropertyValue>{issuance.redemptionDate}</PropertyValue>
          </Property>
        </Properties>
      </PanelContent>
    </Panel>
  );
};
