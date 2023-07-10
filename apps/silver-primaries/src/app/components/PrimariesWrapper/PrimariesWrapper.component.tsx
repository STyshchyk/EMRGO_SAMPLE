import { FC } from "react";
import * as React from "react";
import { Link, Outlet } from "react-router-dom";

import { getAllSilverRoutes, silverPrimariesRoutes } from "@emrgo-frontend/constants";
import { Badge, Tab, Tabs } from "@emrgo-frontend/shared-ui";
import { useInternalMatchedPathTabs } from "@emrgo-frontend/utils";

import * as Styles from "./PrimariesWrapper.styles";
import { IPrimariesWrapperProps } from "./PrimariesWrapper.types";

const primariesTab = [
  {
    label: "Trade Opportunities",
    key: "trade-opportunities",
    paths: getAllSilverRoutes(silverPrimariesRoutes),
    path: silverPrimariesRoutes.primaries.tradeOpportunity.home,
    notification: 0
  },
  {
    label: "Trade Management",
    key: "trade-management",
    paths: getAllSilverRoutes(silverPrimariesRoutes),
    path: silverPrimariesRoutes.primaries.tradeManagement.home,
    notification: 0
  },

];
export const PrimariesWrapperComponent: FC<IPrimariesWrapperProps> = ({ children }: IPrimariesWrapperProps) => {
  const value: any = useInternalMatchedPathTabs(primariesTab);
  return <Styles.PrimariesWrapper>
    <Tabs value={value}>
      {primariesTab.map((tab) => (
        <Tab value={tab.path} as={Link} to={tab.path} key={tab.path}>
          {tab.label}
          {tab.notification > 0 && <Badge>{tab.notification}</Badge>}
        </Tab>
      ))}
    </Tabs>
   <Outlet/>
  </Styles.PrimariesWrapper>;
};
