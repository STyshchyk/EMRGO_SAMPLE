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

import { IssuanceTable } from "../../pages/TradeOpportunities/IssuanceTable";
import { useTradeOpportunitiesContext } from "../../pages/TradeOpportunities/TradeOpportunities.provider";
import { IBankPanelProps } from "./BankPanel.types";

export const BankPanel: FC<IBankPanelProps> = ({ bank }) => {
  const { logo, opportunities, bankId } = bank;
  const bankLogo = logo;
  const { toggleIssuanceOnWatchlist, goToIssuanceDetails, searchQuery, setSearchQuery } =
    ensureNotNull(useTradeOpportunitiesContext());

  return (
    <Panel>
      <PanelHeader>
        <PanelHeaderImage src={`${bankLogo}`} />
        <PanelHeaderRight>
          <Hyperlink as={Link} to={`${bankId}/issuances`}>
            View all
          </Hyperlink>
        </PanelHeaderRight>
      </PanelHeader>
      <PanelContent>
        <IssuanceTable
          opportunities={opportunities}
          onToggleIssuanceOnWatchlist={toggleIssuanceOnWatchlist}
          onIssuanceClick={goToIssuanceDetails}
          bankId={bankId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </PanelContent>
    </Panel>
  );
};
