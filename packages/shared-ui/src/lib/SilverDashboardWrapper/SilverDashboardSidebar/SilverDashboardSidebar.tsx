import { Fragment } from "react";
import { Link } from "react-router-dom";

import {
  HelpModal,
  Logo,
  SidebarFooter,
  SidebarHeader,
  SidebarList,
  SidebarListItem,
  SidebarListItemIcon,
  SidebarListItemLink,
  SidebarListItemSecondaryLink,
  Tooltip,
  TooltipContent,
  TooltipHeader,
  TooltipTitle,
} from "@emrgo-frontend/shared-ui";
import {
  ensureNotNull,
  navigateSilverModule,
  useInternalMatchedPathDashboard,
} from "@emrgo-frontend/utils";

import { useSilverDashboardWrapperContext } from "../SilverDashboardWrapper.provider";
import * as Styles from "./SilverDashboardSidebar.styles";

export const SilverDashboardSidebar = () => {
  const {
    mainRoutes,
    roles,
    user,
    doLogout,
    currentRole,
    enableRoleMapping,
    footerRoutes,
    isHelpDeskOpen,
    setHelpDeskOpen,
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
            <Tooltip
              content={
                module.disabled || !useInternalMatchedPathDashboard(module) ? (
                  <Fragment>
                    <TooltipHeader>
                      <TooltipTitle>You do not have access to this page</TooltipTitle>
                    </TooltipHeader>
                    <TooltipContent>
                      The {module.label} module is under construction and will be ready soon. Please
                      check back later for updates.
                    </TooltipContent>
                  </Fragment>
                ) : (
                  ""
                )
              }
            >
              <SidebarListItem key={module.key}>
                <SidebarListItemLink
                  onClick={() => {
                    if (!enableRoleMapping) navigateSilverModule(module.key, module.path);
                    if (currentRole?.access.includes(module.key)) {
                      navigateSilverModule(module.key, module.path);
                    }
                  }}
                  disabled={enableRoleMapping && !currentRole?.access.includes(module.key)}
                  className={useInternalMatchedPathDashboard(module) ? "active" : ""}
                >
                  <SidebarListItemIcon>{module.icon}</SidebarListItemIcon>
                  {module.label}
                </SidebarListItemLink>
              </SidebarListItem>
            </Tooltip>
          ))}
        </SidebarList>
      </nav>
      <SidebarFooter>
        <SidebarList>
          {footerRoutes.map((module) => (
            <Tooltip
              content={
                module.disabled ? (
                  <Fragment>
                    <TooltipHeader>
                      <TooltipTitle>Coming Soon...</TooltipTitle>
                    </TooltipHeader>
                    <TooltipContent>
                      The {module.label} module is under construction and will be ready soon. Please
                      check back later for updates.
                    </TooltipContent>
                  </Fragment>
                ) : (
                  ""
                )
              }
            >
              <SidebarListItem key={module.key}>
                <SidebarListItemSecondaryLink
                  onClick={() => {
                    if (module.onClick) module.onClick();
                  }}
                  disabled={module.disabled}
                >
                  <SidebarListItemIcon>{module.icon}</SidebarListItemIcon>
                  {module.label}
                </SidebarListItemSecondaryLink>
              </SidebarListItem>
            </Tooltip>
          ))}
          {/*<SidebarListItem>*/}
          {/*  <SidebarListItemSecondaryLink*/}
          {/*    onClick={() => {*/}
          {/*      doLogout();*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <SidebarListItemIcon>*/}
          {/*      <AccountIcon />*/}
          {/*    </SidebarListItemIcon>*/}
          {/*    Log out*/}
          {/*  </SidebarListItemSecondaryLink>*/}
          {/*</SidebarListItem>*/}
          {/*<SidebarListItem>*/}
          {/*  <SidebarListItemSecondaryLink href="#">*/}
          {/*    <Styles.SidebarListItemIconWithBadge>*/}
          {/*      <NotificationsIcon />*/}
          {/*      <Styles.NotificationsBadge>{}</Styles.NotificationsBadge>*/}
          {/*    </Styles.SidebarListItemIconWithBadge>*/}
          {/*    Notifications*/}
          {/*  </SidebarListItemSecondaryLink>*/}
          {/*</SidebarListItem>*/}
          {/*<SidebarListItem>*/}
          {/*  <SidebarListItemSecondaryLink href="#">*/}
          {/*    <SidebarListItemIcon>*/}
          {/*      <AccountIcon />*/}
          {/*    </SidebarListItemIcon>*/}
          {/*    Account*/}
          {/*  </SidebarListItemSecondaryLink>*/}
          {/*</SidebarListItem>*/}
          {/*<SidebarListItem>*/}
          {/*  <SidebarListItemSecondaryLink href="#">*/}
          {/*    <SidebarListItemIcon>*/}
          {/*      <HelpIcon />*/}
          {/*    </SidebarListItemIcon>*/}
          {/*    Help*/}
          {/*  </SidebarListItemSecondaryLink>*/}
          {/*</SidebarListItem>*/}
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
      <HelpModal isOpen={isHelpDeskOpen} onClose={() => setHelpDeskOpen(false)} />
    </Styles.DashboardSidebar>
  );
};
