import { Link, NavLink } from "react-router-dom";

import {
  AccountIcon,
  HelpIcon,
  Logo,
  NotificationsIcon,
  PrimariesIcon,
  SidebarFooter,
  SidebarHeader,
  SidebarList,
  SidebarListItem,
  SidebarListItemIcon,
  SidebarListItemLink,
  SidebarListItemSecondaryLink
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull, useInternalMatchedPathDashboard } from "@emrgo-frontend/utils";
import { useMutation } from "@tanstack/react-query";

import routes from "../../../constants/routes";
import { logoutUser } from "../../../pages/Authentication/Login/Login.services";
import { useUserStore } from "../../../pages/Authentication/store";
import { useDashboardWrapperContext } from "../SilverDashboardWrapper.provider";
import * as Styles from "./SilverDashboardSidebar.styles";

const mainRoutes = [
  {
    label: "Administration",
    icon: <PrimariesIcon />,
    key: "/administration",
    paths: [routes.dash.administration.users]
  },
  {
    label: "Primaries",
    icon: <PrimariesIcon />,
    key: "/primaries",
    paths: [
      routes.dash.primaries.tradeOpportunityHome,
      routes.dash.primaries.tradeManagement,
      routes.dash.primaries.tradeOpportunity.issuances]
  },
  {
    label: "Onboarding",
    icon: <PrimariesIcon />,
    key: "/onboarding",
    paths: [routes.dash.onboarding.users]
  },
  {
    label: "Data Room",
    icon: <PrimariesIcon />,
    key: "/data-room",
    paths: [routes.dash.dataRoom.platform, routes.dash.dataRoom.opportunities]
  }
];

export const SilverDashboardSidebar = () => {
  const { numberOfNotifications } = ensureNotNull(useDashboardWrapperContext());
  const { removeUser } = useUserStore();
  const logout = useMutation(logoutUser, {
    onSuccess: () => {
      removeUser();
      window.location.assign(routes.auth.login);
    }
  });
  // console.log(useMatch({ path: "primaries", end: false, caseSensitive: false }));
  // console.log(value);
  return (
    <Styles.DashboardSidebar>
      <SidebarHeader>
        <Link to={routes.dash.administration.users}>
          <Logo />
        </Link>
      </SidebarHeader>
      <nav>
        <SidebarList>
          {mainRoutes.map((module) => (
            <SidebarListItem key={module.key}>
              <SidebarListItemLink
                as={NavLink}
                to={module.paths[0]}
                className={useInternalMatchedPathDashboard(module) ? "active" : ""}>
                <SidebarListItemIcon>{module.icon}</SidebarListItemIcon>
                {module.label}
              </SidebarListItemLink>
            </SidebarListItem>
          ))}
        </SidebarList>
      </nav>

      <SidebarFooter>
        <SidebarList>
          <SidebarListItem>
            <SidebarListItemSecondaryLink
              onClick={() => {
                logout.mutate();
              }}
            >
              <SidebarListItemIcon>
                <AccountIcon />
              </SidebarListItemIcon>
              Log out
            </SidebarListItemSecondaryLink>
          </SidebarListItem>
          <SidebarListItem>
            <SidebarListItemSecondaryLink href="#">
              <Styles.SidebarListItemIconWithBadge>
                <NotificationsIcon />
                <Styles.NotificationsBadge>{numberOfNotifications}</Styles.NotificationsBadge>
              </Styles.SidebarListItemIconWithBadge>
              Notifications
            </SidebarListItemSecondaryLink>
          </SidebarListItem>
          <SidebarListItem>
            <SidebarListItemSecondaryLink href="#">
              <SidebarListItemIcon>
                <AccountIcon />
              </SidebarListItemIcon>
              Account
            </SidebarListItemSecondaryLink>
          </SidebarListItem>
          <SidebarListItem>
            <SidebarListItemSecondaryLink href="#">
              <SidebarListItemIcon>
                <HelpIcon />
              </SidebarListItemIcon>
              Help
            </SidebarListItemSecondaryLink>
          </SidebarListItem>
          {/*<SidebarListItem>*/}
          {/*  <SidebarListItemContent>*/}
          {/*    <SidebarListItemIcon>*/}
          {/*      <EyeIcon />*/}
          {/*    </SidebarListItemIcon>*/}
          {/*    <ThemeSwitcher theme={isDarkMode ? "dark" : "light"} onToggle={toggle} />*/}
          {/*  </SidebarListItemContent>*/}
          {/*</SidebarListItem>*/}
        </SidebarList>
      </SidebarFooter>
    </Styles.DashboardSidebar>
  );
};
