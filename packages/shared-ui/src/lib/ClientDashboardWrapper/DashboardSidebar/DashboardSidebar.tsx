import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  clientAccountRoutes,
  clientCustodyRoutes,
  clientModuleURLs,
  clientPrimariesRoutes,
  clientSecondariesRoutes,
  getAllRoutes,
  roles,
} from "@emrgo-frontend/constants";
import {
  AccountIcon,
  ChevronRightIcon,
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
  TermsModal,
  ThemeSwitcher,
  Tooltip,
  useUser,
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
import { DashboardSidebarAccountTooltip } from "./DashboardSidebarAccountTooltip";

export const DashboardSidebar = () => {
  const origin = window.location.origin;
  const { user } = useUser();
  const currentRole = roles.find((role) => role.key === user?.role);
  const { isDarkMode, toggle } = useDarkMode();
  const {
    numberOfNotifications,
    mainRoutes,
    fullName,
    navigateToModule,
    allAccountRoutes,
    onAcceptPlatformTerms,
    onRejectPlatformTerms,
    showTermsModal,
    termsDocumentURL,
  } = ensureNotNull(useDashboardWrapperContext());

  const hasAcceptedPlatformTerms = user?.hasAcceptedSilverTnc;

  const fullNameInitials = fullName
    .split(" ")
    .map((part) => part[0].toUpperCase())
    .join("");

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
                  if (currentRole?.access.includes(module.key)) {
                    navigateToModule(module.key, module.path);
                  }
                }}
                active={useClientMatchedPathSidebar(module.paths)}
                disabled={!currentRole?.access.includes(module.key)}
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
          <Tooltip content={<DashboardSidebarAccountTooltip user={user} />}>
            <SidebarListItem>
              <SidebarListItemSecondaryLink>
                <Styles.SidebarListItemAccountAvatar>
                  {fullNameInitials}
                </Styles.SidebarListItemAccountAvatar>
                <Styles.SidebarListItemAccountLabel>
                  {currentRole?.label}
                </Styles.SidebarListItemAccountLabel>
                <SidebarListItemIcon>
                  <ChevronRightIcon />
                </SidebarListItemIcon>
              </SidebarListItemSecondaryLink>
            </SidebarListItem>
          </Tooltip>
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

      <TermsModal
        title="Platform Terms"
        subtitle={!hasAcceptedPlatformTerms ? "Please accept our platform terms to proceed." : ""}
        documentURL={termsDocumentURL}
        isOpen={showTermsModal === "tnc"}
        onAccept={onAcceptPlatformTerms}
        onReject={onRejectPlatformTerms}
        hasAccepted={hasAcceptedPlatformTerms}
        type={showTermsModal}
      />
    </Styles.DashboardSidebar>
  );
};
