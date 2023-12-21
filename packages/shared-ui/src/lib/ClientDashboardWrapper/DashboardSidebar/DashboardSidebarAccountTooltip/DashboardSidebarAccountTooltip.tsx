import { FC } from "react";

import { clientAccountRoutes, roles as staticRoles } from "@emrgo-frontend/constants";
import { ensureNotNull, navigateModule } from "@emrgo-frontend/utils";

import { IconButton } from "../../../IconButton";
import { AccountIcon, LogoutIcon } from "../../../Icons";
import { SidebarList, SidebarListItem, SidebarListItemSecondaryLink } from "../../../Sidebar";
import { TooltipContent } from "../../../Tooltip";
import { useDashboardWrapperContext } from "../../DashboardWrapper.provider";
import { IDashboardSidebarAccountTooltipProps } from "./DashboardSidebarAccountTooltip.types";

export const DashboardSidebarAccountTooltip: FC<IDashboardSidebarAccountTooltipProps> = (props) => {
  const { user } = props;
  const { changeUserRole, roles, onLogOut } = ensureNotNull(useDashboardWrapperContext());
  return (
    <TooltipContent>
      <p className="text-center text-sm font-bold">{user?.entityName}</p>
      <p className="text-center text-xs mb-2">
        {user?.firstName} {user?.lastName}
      </p>
      <div className="flex justify-center gap-x-4 mb-4">
        <IconButton
          onClick={() => {
            navigateModule("account", clientAccountRoutes.home);
          }}
        >
          <AccountIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            onLogOut();
          }}
        >
          <LogoutIcon />
        </IconButton>
      </div>
      <p className="my-2">Select one of your available roles</p>
      <SidebarList className="my-2">
        {roles?.map((role: string) => {
          const roleConfig = staticRoles.find((staticRole) => staticRole.key === role);
          return (
            <SidebarListItem key={role}>
              {roleConfig && (
                <SidebarListItemSecondaryLink
                  onClick={() => changeUserRole(roleConfig)}
                  className={`p-0 rounded ${roleConfig.key === user?.role ? "active" : ""}`}
                >
                  {roleConfig.label}
                </SidebarListItemSecondaryLink>
              )}
            </SidebarListItem>
          );
        })}
      </SidebarList>
      <p className="mt-2">Access to different modules could change based on the selected role.</p>
    </TooltipContent>
  );
};
