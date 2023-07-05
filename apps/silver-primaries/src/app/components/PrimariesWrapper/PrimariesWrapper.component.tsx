import { FC } from "react";

import * as Styles from "./PrimariesWrapper.styles";
import { IPrimariesWrapperProps } from "./PrimariesWrapper.types";
import { getAllSilverRoutes, silverPrimariesRoutes } from "@emrgo-frontend/constants";
import { Badge, Tab, Tabs } from "@emrgo-frontend/shared-ui";
import { Link, Outlet } from "react-router-dom";
import * as React from "react";
import { useInternalMatchedPathTabs } from "@emrgo-frontend/utils";

const primariesTab = [
  {
    label: "Trade Opportunities",
    key: "trade-opportunities",
    paths: getAllSilverRoutes(silverPrimariesRoutes),
    notification: 0
  }
];
export const PrimariesWrapperComponent: FC<IPrimariesWrapperProps> = ({ children }: IPrimariesWrapperProps) => {
  const value: any = useInternalMatchedPathTabs(primariesTab);
  return <Styles.PrimariesWrapper>
    <Tabs value={value}>
      {primariesTab.map((tab) => (
        <Tab value={tab.key} as={Link} to={tab.paths[0]} key={tab.key}>
          {tab.label}
          {tab.notification > 0 && <Badge>{tab.notification}</Badge>}
        </Tab>
      ))}
    </Tabs>
   <Outlet/>
  </Styles.PrimariesWrapper>;
};
