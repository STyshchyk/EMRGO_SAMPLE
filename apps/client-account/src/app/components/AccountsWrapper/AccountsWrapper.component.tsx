import { FC } from "react";
import { Link } from "react-router-dom";

import { clientAccountRoutes as routes } from "@emrgo-frontend/constants";
import { Badge, Tab, Tabs, useUser } from "@emrgo-frontend/shared-ui";
import { ensureNotNull, useMatchedPath } from "@emrgo-frontend/utils";

import { useAccountsWrapperContext } from "./AccountsWrapper.provider";
import * as Styles from "./AccountsWrapper.styles";
import { IAccountsWrapperProps } from "./AccountsWrapper.types";

export const AccountsWrapperComponent: FC<IAccountsWrapperProps> = ({ children }) => {
  const contextProps = ensureNotNull(useAccountsWrapperContext());

  const primariesTabs = [
    {
      label: "User Details",
      key: "user-details",
      paths: [routes.account.userDetails],
      notification: 0
    },
    {
      label: "Account Security",
      key: "account-security",
      paths: [routes.account.accountSecurity],
      notification: 0
    },
    {
      label: "Platform Access",
      key: "platform-access",
      paths: [routes.account.platformAccess],
      notification: 0
    },
    {
      label: "Data Room",
      key: "dataroom",
      paths: [routes.account.dataRoom],
      notification: 0
    },
    {
      label: "Onboard User",
      key: "onboard",
      paths: [routes.account.onboardUser],
      notification: 0,
      roles: ["invst_mngr", "manager", "admin"]//List of allowed roles. Empry  == allow all
    }
  ];
  const value = useMatchedPath(primariesTabs);
  const { user } = useUser();
  console.log(user);
  const filteredTabs = primariesTabs.filter(tab => {
    if (!tab.roles || tab.roles.length === 0) return true;
    return !!tab.roles.includes(user?.role ?? "");
  });

  return (
    <Styles.Accounts>
      <Tabs value={value}>
        {filteredTabs.map((tab) => (
          <Tab value={tab.key} as={Link} to={tab.paths[0]} key={tab.key}>
            {tab.label}
            {tab.notification > 0 && <Badge>{tab.notification}</Badge>}
          </Tab>
        ))}
      </Tabs>

      {children}
    </Styles.Accounts>
  );
};
