import * as React from "react";
import { FC } from "react";
import { Link, Outlet } from "react-router-dom";

import {
  getAllSilverRoutes,
  silverAdministrationRoutes,
  silverAdministrationRoutes as routes
} from "@emrgo-frontend/constants";
import { Badge, Tab, Tabs } from "@emrgo-frontend/shared-ui";
import { ensureNotNull, useInternalMatchedPathTabs } from "@emrgo-frontend/utils";

import { useAdministrationContext } from "./Administration.provider";
import * as Styles from "./Administration.styles";
import { IAdministrationProps } from "./Administration.types";




export const AdministrationComponent: FC<IAdministrationProps> = ({}: IAdministrationProps) => {
  const { numberOfNewTradeOpportunities } = ensureNotNull(useAdministrationContext());
  return (
    <Styles.Administration>
      <Outlet />
    </Styles.Administration>
  );
};
