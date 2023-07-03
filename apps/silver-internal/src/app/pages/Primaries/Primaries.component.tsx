import * as React from "react";
import { FC } from "react";
import { Link, Outlet } from "react-router-dom";

import { Tab, Tabs } from "@emrgo-frontend/shared-ui";
import { ensureNotNull, useInternalMatchedPathTabs } from "@emrgo-frontend/utils";

import { Badge } from "../../components/Badge";
import routes from "../../constants/routes";
import { usePrimariesContext } from "./Primaries.provider";
import * as Styles from "./Primaries.styles";
import { IPrimariesProps } from "./Primaries.types";


const primariesTab = [
  {
    label: "Trade Opportunities",
    key: "/primaries/trade-opportunities",
    paths: [
      routes.dash.primaries.tradeOpportunityHome,
      routes.dash.primaries.tradeOpportunity.manageIssuers,
      routes.dash.primaries.tradeOpportunity.issuances,
      routes.dash.primaries.tradeOpportunity.manageSellside
    ],
    notification: 0
  }
];
export const PrimariesComponent: FC<IPrimariesProps> = ({}: IPrimariesProps) => {
  const { numberOfNewTradeOpportunities } = ensureNotNull(usePrimariesContext());
  const value: any = useInternalMatchedPathTabs(primariesTab);
  return (
    <Styles.Primaries>
      <Tabs value={value}>
        {primariesTab.map((tab) => (
          <Tab value={tab.key} as={Link} to={tab.paths[0]} key={tab.key}>
            {tab.label}
            {tab.notification > 0 && <Badge>{tab.notification}</Badge>}
          </Tab>
        ))}
      </Tabs>

      <Outlet />
    </Styles.Primaries>
  );
};
