import { FC, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";

import { silverModuleURLs } from "@emrgo-frontend/constants";
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
import { reverse } from "named-urls";

import { useSilverDashboardWrapperContext } from "../SilverDashboardWrapper.provider";
import * as Styles from "./SilverDashboardSidebar.styles";

export const SilverDashboardSidebar: FC<{ isHidden: boolean }> = ({ isHidden }) => {
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
  const navigate = useNavigate();
  return (
    <Styles.DashboardSidebar>
      <SidebarHeader $isHidden={isHidden}>
        <Link to={""}>
          <Logo isHidden={isHidden} />
        </Link>
      </SidebarHeader>
      <nav>
        <SidebarList>
          {mainRoutes.map((module) => (
            <Tooltip
              key={module.key}
              content={
                module.disabled ? (
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
              <SidebarListItem>
                <SidebarListItemLink
                  onClick={() => {
                    if (!enableRoleMapping) navigateSilverModule(module.key, module.path);
                    if (currentRole?.access.includes(module.key)) {
                      const originPath = silverModuleURLs[module.key];
                      const { origin } = window.location;
                      if (origin === originPath) navigate(module.path);
                      else navigateSilverModule(module.key, module.path);
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
              key={module.key}
              content={
                module.disabled ? (
                  <Fragment>
                    <TooltipHeader>
                      <TooltipTitle>Coming Soon</TooltipTitle>
                    </TooltipHeader>
                    {/* <TooltipContent>
                      The {module.label} module is under construction and will be ready soon. Please
                      check back later for updates.
                    </TooltipContent> */}
                  </Fragment>
                ) : (
                  ""
                )
              }
            >
              <SidebarListItem>
                <SidebarListItemSecondaryLink
                  onClick={(event) => {
                    event.stopPropagation();
                    const originPath = silverModuleURLs[module.key];
                    const { origin } = window.location;
                    navigate(reverse(module.path, {}));
                    if (module.onClick) module.onClick();
                  }}
                  disabled={module.disabled}
                  className={useInternalMatchedPathDashboard(module) ? "active" : ""}
                >
                  <SidebarListItemIcon>{module.icon}</SidebarListItemIcon>
                  {module.label}
                </SidebarListItemSecondaryLink>
              </SidebarListItem>
            </Tooltip>
          ))}
        </SidebarList>
      </SidebarFooter>
      <HelpModal isOpen={isHelpDeskOpen} onClose={() => setHelpDeskOpen(false)} />
    </Styles.DashboardSidebar>
  );
};
