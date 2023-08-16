import { Link } from "react-router-dom";

import {
  getAllSilverRoutes,
  silverAdministrationRoutes,
  silverAuthenticationRoutes,
  silverDataRoomRoutes,
  silverOnboardingRoutes,
  silverPrimariesRoutes,
  heliumCustodyRoutes, roles, silverRoles
} from "@emrgo-frontend/constants";
import { logoutUser } from "@emrgo-frontend/services";
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
import {
  ensureNotNull,
  navigateSilverModule,
  silverModule,
  useInternalMatchedPathDashboard
} from "@emrgo-frontend/utils";
import { useMutation } from "@tanstack/react-query";

import { useSilverDashboardWrapperContext } from "../SilverDashboardWrapper.provider";
import * as Styles from "./SilverDashboardSidebar.styles";


export const SilverDashboardSidebar = () => {
  const {
    mainRoutes,
    roles,
    user,
    doLogout,
    currentRole
  } = ensureNotNull(useSilverDashboardWrapperContext());

  return (
    <Styles.DashboardSidebar>
      <SidebarHeader>
        <Link to={""}>
          <Logo />
        </Link>
      </SidebarHeader>
      <nav>
        <SidebarList>
          {mainRoutes.map((module) => (
            <SidebarListItem key={module.key}>
              <SidebarListItemLink
                onClick={() => {
                  if (currentRole?.access.includes(module.key)) {
                    navigateSilverModule(module.key, module.path);
                  }
                }}
                disabled={!currentRole?.access.includes(module.key)}
                className={useInternalMatchedPathDashboard(module) ? "active" : ""}
              >
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
                doLogout();
                navigateSilverModule(silverModule.authentication, silverAuthenticationRoutes.home);
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
                <Styles.NotificationsBadge>{}</Styles.NotificationsBadge>
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
