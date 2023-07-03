import * as React from "react";
import {FC} from "react";
import {Link, Outlet} from "react-router-dom";

import {Badge, Tab, Tabs} from "@emrgo-frontend/shared-ui";
import {ensureNotNull, useInternalMatchedPathTabs} from "@emrgo-frontend/utils";

import routes from "../../constants/routes";
import {useAdministrationContext} from "./Administration.provider";
import * as Styles from "./Administration.styles";
import {IAdministrationProps} from "./Administration.types";


const administrationTab = [
  {
    label: "Users",
    key: "users",
    paths: [routes.dash.administration.users],
    notification: 0
  }

];


export const AdministrationComponent: FC<IAdministrationProps> = ({}: IAdministrationProps) => {
  const value = useInternalMatchedPathTabs(administrationTab);
  const { numberOfNewTradeOpportunities } = ensureNotNull(useAdministrationContext());
  return (
    <Styles.Administration>
      {/*<Tabs value={value}>*/}
      {/*  <Tab value="users" as={Link} to="/">*/}
      {/*    Users*/}
      {/*  </Tab>*/}
      {/*  /!*<Tab value="trade-management" as={Link} to="trade-management">*!/*/}
      {/*  /!*  Trade Management*!/*/}
      {/*  /!*</Tab>*!/*/}
      {/*  /!*<Tab value="post-trade" as={Link} to="post-trade">*!/*/}
      {/*  /!*  Post-Trade*!/*/}
      {/*  /!*</Tab>*!/*/}
      {/*</Tabs>*/}
      <Tabs value={value}>
        {administrationTab.map((tab) => (
          <Tab value={tab.key} as={Link} to={tab.paths[0]} key={tab.key}>
            {tab.label}
            {tab.notification > 0 && <Badge>{tab.notification}</Badge>}
          </Tab>
        ))}
      </Tabs>
      <Outlet />
    </Styles.Administration>
  );
};
