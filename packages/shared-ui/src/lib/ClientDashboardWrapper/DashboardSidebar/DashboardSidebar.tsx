import { Link, NavLink } from "react-router-dom";

import {
  clientAccountRoutes,
  clientPrimariesRoutes,
  clientSecondariesRoutes,
  getAllRoutes,
} from "@emrgo-frontend/constants";
import {
  AccountIcon,
  CustodyIcon,
  EyeIcon,
  HelpIcon,
  Logo,
  NotificationsIcon,
  PrimariesIcon,
  ResearchIcon,
  SecondariesIcon,
  SidebarFooter,
  SidebarHeader,
  SidebarList,
  SidebarListItem,
  SidebarListItemContent,
  SidebarListItemIcon,
  SidebarListItemLink,
  SidebarListItemSecondaryLink,
  ThemeSwitcher,
} from "@emrgo-frontend/shared-ui";
import {
  buildModuleURL,
  ensureNotNull,
  navigateModule,
  useClientMatchedPathSidebar,
} from "@emrgo-frontend/utils";
import { useDarkMode } from "usehooks-ts";

import { useDashboardWrapperContext } from "../DashboardWrapper.provider";
import * as Styles from "./DashboardSidebar.styles";

export const DashboardSidebar = () => {
  const { isDarkMode, toggle } = useDarkMode();
  const { numberOfNotifications } = ensureNotNull(useDashboardWrapperContext());

  const mainRoutes = [
    {
      label: "Primaries",
      icon: <PrimariesIcon />,
      key: "primaries",
      path: clientPrimariesRoutes.home,
      paths: getAllRoutes(clientPrimariesRoutes),
    },
    {
      label: "Secondaries",
      icon: <SecondariesIcon />,
      key: "secondaries",
      path: clientSecondariesRoutes.home,
      paths: getAllRoutes(clientSecondariesRoutes),
    },
    {
      label: "Custody",
      icon: <CustodyIcon />,
      key: "custody",
      path: clientSecondariesRoutes.home,
      paths: [""],
    },
    {
      label: "Research",
      icon: <ResearchIcon />,
      key: "research",
      path: clientSecondariesRoutes.home,
      paths: [""],
    },
  ];

  const navigateToModule = (module: string, path: string) => {
    navigateModule(module, path);
  };

  const allAccountRoutes = getAllRoutes(clientAccountRoutes);

  return (
    <Styles.DashboardSidebar>
      <SidebarHeader>
        <Link to="/">
          <Logo />
        </Link>
      </SidebarHeader>

      <nav>
        <SidebarList>
          {mainRoutes.map((module) => (
            <SidebarListItem key={module.key}>
              <SidebarListItemLink
                onClick={() => {
                  navigateToModule(module.key, module.path);
                }}
                className={useClientMatchedPathSidebar(module.paths) ? "active" : ""}
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
            <SidebarListItemSecondaryLink href="#">
              <Styles.SidebarListItemIconWithBadge>
                <NotificationsIcon />
                <Styles.NotificationsBadge>{numberOfNotifications}</Styles.NotificationsBadge>
              </Styles.SidebarListItemIconWithBadge>
              Notifications
            </SidebarListItemSecondaryLink>
          </SidebarListItem>
          <SidebarListItem>
            <SidebarListItemSecondaryLink
              href={buildModuleURL("account", clientAccountRoutes.home)}
              className={useClientMatchedPathSidebar(allAccountRoutes) ? "active" : ""}
            >
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
          <SidebarListItem>
            <SidebarListItemContent>
              <SidebarListItemIcon>
                <EyeIcon />
              </SidebarListItemIcon>
              <ThemeSwitcher theme={isDarkMode ? "dark" : "light"} onToggle={toggle} />
            </SidebarListItemContent>
          </SidebarListItem>
        </SidebarList>
      </SidebarFooter>
    </Styles.DashboardSidebar>
  );
};
