import { Fragment, useState } from "react";
import { Link } from "react-router-dom";

import { clientAccountRoutes, roles } from "@emrgo-frontend/constants";
import { useDarkModeCustom } from "@emrgo-frontend/services";
import {
  AccountIcon,
  ChevronRightIcon,
  EyeIcon,
  HelpIcon,
  HelpModal,
  Logo,
  NotificationsIcon,
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
  TooltipContent,
  TooltipHeader,
  TooltipTitle,
  useUser,
} from "@emrgo-frontend/shared-ui";
import { buildModuleURL, ensureNotNull, useClientMatchedPathSidebar } from "@emrgo-frontend/utils";
import { useDarkMode } from "usehooks-ts";

import { useDashboardWrapperContext } from "../DashboardWrapper.provider";
import * as Styles from "./DashboardSidebar.styles";
import { DashboardSidebarAccountTooltip } from "./DashboardSidebarAccountTooltip";

export const DashboardSidebar = () => {
  const origin = window.location.origin;
  const { user } = useUser();
  const currentRole = roles.find((role) => role.key === user?.role);

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
    setHelpDeskOpen,
    isHelpDeskOpen,
  } = ensureNotNull(useDashboardWrapperContext());

  const [value, setvalue] = useState(false);
  const [isDarkModeCustom, enable, disable, toggle] = useDarkModeCustom();
  const { isDarkMode } = useDarkMode();
  const hasAcceptedPlatformTerms = user?.hasAcceptedSilverTnc;
  const fullNameInitials = fullName
    .split(" ")
    .filter((part) => part !== "")
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
            <Tooltip
              enableTooltip={module.disabled}
              key={module.key}
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
                <SidebarListItemLink
                  onClick={() => {
                    if (currentRole?.access.includes(module.key)) {
                      navigateToModule(module.key, module.path);
                    }
                  }}
                  active={useClientMatchedPathSidebar(module.paths)}
                  disabled={module.disabled || !currentRole?.access.includes(module.key)}
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
            <SidebarListItemSecondaryLink disabled={true}>
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
            <SidebarListItemSecondaryLink
              onClick={() => {
                setHelpDeskOpen(true);
              }}
            >
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
              <ThemeSwitcher
                theme={isDarkMode ? "dark" : "light"}
                onToggle={() => {
                  toggle();
                }}
              />
            </SidebarListItemContent>
          </SidebarListItem>
        </SidebarList>
      </SidebarFooter>

      <TermsModal
        title="Platform Terms"
        subtitle={!hasAcceptedPlatformTerms ? "Please accept our platform terms to proceed." : ""}
        documentURL={termsDocumentURL}
        isOpen={!user?.hasAcceptedSilverTnc && showTermsModal === "tnc"}
        onAccept={onAcceptPlatformTerms}
        onReject={onRejectPlatformTerms}
        hasAccepted={hasAcceptedPlatformTerms}
        type={showTermsModal}
        warningMessage = "You will be logged out if you do not accept the platform terms"
      />

      <HelpModal isOpen={isHelpDeskOpen} onClose={() => setHelpDeskOpen(false)} />
    </Styles.DashboardSidebar>
  );
};
