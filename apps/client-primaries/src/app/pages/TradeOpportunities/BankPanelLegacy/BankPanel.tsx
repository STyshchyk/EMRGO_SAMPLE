import { FC } from "react";
import { Link } from "react-router-dom";

import {
  Hyperlink,
  Panel,
  PanelContent,
  PanelHeader,
  PanelHeaderImage,
  PanelHeaderRight,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { useDarkMode } from "usehooks-ts";

import { IssuanceTable } from "../IssuanceTable";
import { useTradeOpportunitiesContext } from "../TradeOpportunities.provider";
import { IBankPanelProps } from "./BankPanel.types";

export const BankPanel: FC<IBankPanelProps> = ({ bank }) => {
  const { logo, issuances, id } = bank;
  const { isDarkMode } = useDarkMode();
  const bankLogo = isDarkMode ? logo.dark : logo.light;
  const { toggleIssuanceOnWatchlist, goToIssuanceDetails } = ensureNotNull(
    useTradeOpportunitiesContext()
  );

  return (
    <Panel>
      <PanelHeader>
        <PanelHeaderImage src={bankLogo} />
        <PanelHeaderRight>
          <Hyperlink as={Link} to={`${id}/issuances`}>
            View all
          </Hyperlink>
        </PanelHeaderRight>
      </PanelHeader>
      <PanelContent>
        <IssuanceTable
          issuances={issuances}
          onToggleIssuanceOnWatchlist={toggleIssuanceOnWatchlist}
          onIssuanceClick={goToIssuanceDetails}
        />
      </PanelContent>
    </Panel>
  );
};
