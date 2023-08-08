import { FC } from "react";

import { IconButton } from "../../../IconButton";
import { AccountIcon, LogoutIcon } from "../../../Icons";
import { SidebarList, SidebarListItem, SidebarListItemSecondaryLink } from "../../../Sidebar";
import { TooltipContent } from "../../../Tooltip";
import { IDashboardSidebarAccountTooltipProps } from "./DashboardSidebarAccountTooltip.types";

export const DashboardSidebarAccountTooltip: FC<IDashboardSidebarAccountTooltipProps> = (props) => {
  const { user } = props;
  console.log("🚀 ~ file: DashboardSidebarAccountTooltip.tsx:11 ~ user:", user);
  const roles = [
    {
      label: "Administrator",
      key: "admin",
    },
    {
      label: "Investor",
      key: "invst_mngr",
    },
  ];
  return (
    <TooltipContent>
      <p className="text-center text-sm font-bold">{user?.entityName}</p>
      <p className="text-center text-xs mb-2">
        {user?.firstName} {user?.lastName}
      </p>
      <div className="flex justify-center gap-x-4 mb-4">
        <IconButton onClick={() => {}}>
          <AccountIcon />
        </IconButton>
        <IconButton onClick={() => {}}>
          <LogoutIcon />
        </IconButton>
      </div>
      <p className="my-2">Select one of your available Roles</p>
      <SidebarList className="my-2">
        {roles.map((role, index) => (
          <SidebarListItem>
            <SidebarListItemSecondaryLink
              href="#"
              className={`p-0 rounded ${index === 1 ? "active" : ""}`}
            >
              {role.label}
            </SidebarListItemSecondaryLink>
          </SidebarListItem>
        ))}
      </SidebarList>
      <p className="mt-2">Access to different modules could change based on the selected role.</p>
    </TooltipContent>
  );
};
