import { FC } from "react";

import {
  PanelContent,
  PanelHeader,
  PanelHeaderImage,
  PanelHeaderRight,
  PanelHeaderTitle,
  Property,
  PropertyKey,
  PropertyValue,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { useDarkMode } from "usehooks-ts";

import { getIssuanceTypeLabel } from "../../../../utils/helpers";
import { useIssuanceContext } from "../Issuance.provider";
import * as Styles from "./IssuanceOverviewPanel.styles";
import { IIssuanceOverviewPanelProps } from "./IssuanceOverviewPanel.types";

export const IssuanceOverviewPanel: FC<IIssuanceOverviewPanelProps> = (props) => {
  const { isDarkMode } = useDarkMode();
  const { issuance } = ensureNotNull(useIssuanceContext());
  const bank = issuance?.sellSide;
  const bankLogo = bank?.logo;

  if (!bank || !issuance) {
    return null;
  }

  return (
    <Styles.Panel>
      <PanelHeader>
        <PanelHeaderTitle>Opportunity overview</PanelHeaderTitle>

        <PanelHeaderRight>
          <PanelHeaderImage src={`${bankLogo}`} />
          {/* <PanelHeaderImage src={isDarkMode ? bank.logo.dark : bank.logo.light} /> */}
        </PanelHeaderRight>
      </PanelHeader>
      <PanelContent>
        <Styles.Properties>
          <Property>
            <PropertyKey>Issuer</PropertyKey>
            <PropertyValue>{issuance?.issuer?.name}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Issuer Jurisdiction</PropertyKey>
            <PropertyValue>FIXME {issuance.issuerId}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Industry</PropertyKey>
            <PropertyValue>FIXME {issuance.issuerId}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Product Type</PropertyKey>
            <PropertyValue>{issuance?.type?.name}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Product Details</PropertyKey>
            <PropertyValue>{issuance.productDetails}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Tenor</PropertyKey>
            <PropertyValue>{issuance.tenor}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Currency</PropertyKey>
            <PropertyValue>{issuance?.currency?.name}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Amount</PropertyKey>
            <PropertyValue>{issuance.amount}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Return</PropertyKey>
            <PropertyValue>{issuance.return}%</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>CSD</PropertyKey>
            <PropertyValue>{issuance.csd}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>ISIN</PropertyKey>
            <PropertyValue>{issuance.isin}</PropertyValue>
          </Property>

          <Property>
            <PropertyKey>Custody</PropertyKey>
            <PropertyValue>{issuance.custody}</PropertyValue>
          </Property>
        </Styles.Properties>

        <Styles.ProfileTitle>Issuer Profile</Styles.ProfileTitle>
        <Styles.ProfileDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum
        </Styles.ProfileDetails>
      </PanelContent>
    </Styles.Panel>
  );
};
