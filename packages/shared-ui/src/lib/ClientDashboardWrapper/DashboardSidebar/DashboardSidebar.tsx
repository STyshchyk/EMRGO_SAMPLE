import { FC, Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import * as constants from "@emrgo-frontend/constants";
import { clientAccountRoutes, clientModuleURLs, roles } from "@emrgo-frontend/constants";
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
  TooltipHeader,
  TooltipTitle,
  useUser,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull, useClientMatchedPathSidebar } from "@emrgo-frontend/utils";
import { useDarkMode } from "usehooks-ts";

import { useDashboardWrapperContext } from "../DashboardWrapper.provider";
import * as Styles from "./DashboardSidebar.styles";
import { DashboardSidebarAccountTooltip } from "./DashboardSidebarAccountTooltip";

export const DashboardSidebar: FC<{ isHidden: boolean }> = ({ isHidden }) => {
  const origin = window.location.origin;
  const { user } = useUser();
  // console.log("🚀 ~ file: SecureSideBar.tsx:40 ~ SecureSideBar ~ user:", user);
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
  console.log("🚀 ~ file: SecureSideBar.tsx:56 ~ SecureSideBar ~ showTermsModal:", showTermsModal);
  const navigate = useNavigate();
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
      <SidebarHeader $isHidden={isHidden}>
        <Link to="/">
          <Logo isHidden={isHidden} />
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
            <SidebarListItemSecondaryLink
              onClick={() => {
                const originPath = clientModuleURLs["account"];
                const { origin } = window.location;
                if (origin === originPath) navigate(clientAccountRoutes.secureMessaging.inbox.home);
                else navigateToModule("account", clientAccountRoutes.secureMessaging.inbox.home);
              }}
              className={
                useClientMatchedPathSidebar(
                  constants.getAllRoutes(clientAccountRoutes.secureMessaging)
                )
                  ? "active"
                  : ""
              }
            >
              <Styles.SidebarListItemIconWithBadge>
                <NotificationsIcon />
                {numberOfNotifications > 0 && (
                  <Styles.NotificationsBadge>{numberOfNotifications}</Styles.NotificationsBadge>
                )}
              </Styles.SidebarListItemIconWithBadge>
              Secure Messaging
            </SidebarListItemSecondaryLink>
          </SidebarListItem>
          <SidebarListItem>
            <SidebarListItemSecondaryLink
              onClick={() => {
                const originPath = clientModuleURLs["account"];
                const { origin } = window.location;
                if (origin === originPath) navigate(clientAccountRoutes.home);
                else navigateToModule("account", clientAccountRoutes.home);
              }}
              className={
                useClientMatchedPathSidebar(constants.getAllRoutes(clientAccountRoutes.account))
                  ? "active"
                  : ""
              }
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
        // isOpen={!user?.hasAcceptedSilverTnc && showTermsModal === "tnc"}
        isOpen={showTermsModal === "tnc"}
        onAccept={onAcceptPlatformTerms}
        onReject={onRejectPlatformTerms}
        hasAccepted={hasAcceptedPlatformTerms}
        type={showTermsModal}
        warningMessage="You will be logged out if you do not accept the platform terms"
      />

      <HelpModal isOpen={isHelpDeskOpen} onClose={() => setHelpDeskOpen(false)} />
    </Styles.DashboardSidebar>
  );
};
