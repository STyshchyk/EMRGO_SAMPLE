import { FC } from "react";
import * as React from "react";
import { Link } from "react-router-dom";

import { silverAdministrationRoutes } from "@emrgo-frontend/constants";
import { Badge, Tab, Tabs } from "@emrgo-frontend/shared-ui";
import { useInternalMatchedPathTabs } from "@emrgo-frontend/utils";

import * as Styles from "./AdministrationWrapper.styles";
import { IAdministrationWrapperProps } from "./AdministrationWrapper.types";

export const AdministrationWrapperComponent: FC<IAdministrationWrapperProps> = ({
  children,
}: IAdministrationWrapperProps) => {
  const administrationTab = [
    {
      label: "Users",
      key: "users",
      paths: [silverAdministrationRoutes.administration.users],
      notification: 0,
    },
  ];
  const value = useInternalMatchedPathTabs(administrationTab);

  return (
    <Styles.AdministrationWrapper>
      <Tabs value={value}>
        {administrationTab.map((tab) => (
          <Tab value={tab.key} as={Link} to={tab.paths[0]} key={tab.key}>
            {tab.label}
            {tab.notification > 0 && <Badge>{tab.notification}</Badge>}
          </Tab>
        ))}
      </Tabs>
      {children}
    </Styles.AdministrationWrapper>
  );
};
