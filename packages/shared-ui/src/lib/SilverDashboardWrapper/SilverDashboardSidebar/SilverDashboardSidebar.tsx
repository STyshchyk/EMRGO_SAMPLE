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
import { ensureNotNull, navigateSilverModule, useInternalMatchedPathDashboard } from "@emrgo-frontend/utils";
import { useMutation } from "@tanstack/react-query";

import { useSilverDashboardWrapperContext } from "../SilverDashboardWrapper.provider";
import * as Styles from "./SilverDashboardSidebar.styles";
import {
  clientPrimariesRoutes,
  getAllRoutes,
  getAllSilverRoutes,
  silverAdministrationRoutes, silverDataRoomRoutes, silverOnboardingRoutes, silverPrimariesRoutes
} from "@emrgo-frontend/constants";

const mainRoutes = [
  {
    label: "Administration",
    icon: <PrimariesIcon />,
    key: "administration",
    path: silverAdministrationRoutes.home,
    paths: getAllSilverRoutes(silverAdministrationRoutes)
  },
  {
    label: "Primaries",
    icon: <PrimariesIcon />,
    key: "primaries",
    path: silverPrimariesRoutes.home,
    paths: getAllSilverRoutes(silverPrimariesRoutes)
  },
  {
    label: "Onboarding",
    icon: <PrimariesIcon />,
    key: "onboarding",
    path: silverOnboardingRoutes.home,
    paths: getAllSilverRoutes(silverOnboardingRoutes)
  },
  {
    label: "Data Room",
    icon: <PrimariesIcon />,
    key: "dataroom",
    path: silverDataRoomRoutes.home,
    paths: getAllSilverRoutes(silverDataRoomRoutes)
  }
];

export const SilverDashboardSidebar = () => {
  const { numberOfNotifications } = ensureNotNull(useSilverDashboardWrapperContext());

  // console.log(useMatch({ path: "primaries", end: false, caseSensitive: false }));
  // console.log(value);
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
                  navigateSilverModule(module.key, module.path);
                }}
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
