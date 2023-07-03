import { FC } from "react";

import { Panel, PanelContent, PanelHeader, PanelHeaderImage, PanelHeaderRight } from "@emrgo-frontend/shared-ui";
import { useDarkMode } from "usehooks-ts";

import { IssuanceTable } from "../IssuanceTable/IssuanceTable";
import { IBankPanelProps } from "./BankPanel.types";

export const BankPanel: FC<IBankPanelProps> = ({ bank }) => {
  const { logo, opportunities, bankId } = bank;
  const { isDarkMode } = useDarkMode();
  const bankLogo = isDarkMode ? logo : logo;

  return (
    <Panel>
      <PanelHeader>
        <PanelHeaderImage src={bankLogo} />
        <PanelHeaderRight>
          {/*<Hyperlink as={Link} to={`${bankId}/issuances`}>*/}
          {/*  View all*/}
          {/*</Hyperlink>*/}
        </PanelHeaderRight>
      </PanelHeader>
      <PanelContent>
        <IssuanceTable
          opportunities={opportunities}
        />
      </PanelContent>
    </Panel>
  );
};
