import * as React from "react";
import { FC } from "react";
import { Link, Outlet } from "react-router-dom";

import { getAllSilverRoutes, silverOnboardingRoutes } from "@emrgo-frontend/constants";
import { Badge, Tab, Tabs } from "@emrgo-frontend/shared-ui";
import { useInternalMatchedPathTabs } from "@emrgo-frontend/utils";

import routes from "../../constants/routes";
import * as Styles from "./Onboarding.styles";
import { IOnboardingProps } from "./Onboarding.types";

const onboardingTabs = [
  {
    label: "Users",
    key: "users",
    paths: getAllSilverRoutes(silverOnboardingRoutes),
    path: silverOnboardingRoutes.onboarding.users,
    notification: 0,
  },
];
export const OnboardingComponent: FC<IOnboardingProps> = ({}: IOnboardingProps) => {
  const value = useInternalMatchedPathTabs(onboardingTabs);
  return (
    <Styles.Onboarding>
      <Tabs value={value}>
        {onboardingTabs.map((tab) => (
          <Tab value={tab.key} as={Link} to={tab.path} key={tab.key}>
            {tab.label}
            {tab.notification > 0 && <Badge>{tab.notification}</Badge>}
          </Tab>
        ))}
      </Tabs>
      <Outlet />
    </Styles.Onboarding>
  );
};
