import { FC } from "react";

import {
  ActionTooltip,
  Table,
  TooltipButtonActions,
  TooltipButtonBox,
  useUser,
} from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { useEntityManagementContext } from "../EntityManagement.provider";
import {
  INewUser,
  TNewUserStatus,
  TNewUserTypes,
  UserRoles,
  UserStatus,
} from "../EntityManagement.types";
import { getNewUserStatusLabel, getNewUserTypeLabel } from "../helpers";
import * as Styles from "./InvitedUsersTable.styles";
import { IInvitedUsersTableProps } from "./InvitedUsersTable.types";

const columnHelper = createColumnHelper<INewUser>();

export const InvitedUsersTable: FC<IInvitedUsersTableProps> = ({ users }) => {
  const { onArchiveUser, onCancelInvitation, onResendInvitation, onMakeAdmin, onRevokeAdmin } =
    ensureNotNull(useEntityManagementContext());
  const { user } = useUser();
  console.log("user", user);
  const soleAdminUser = (users: INewUser[]) => {
    let adminCount = 0;
    for (const user of users) {
      if (user.roles?.includes(UserRoles.superUser)) {
        adminCount++;
      }

      if (adminCount > 1) {
        return false; // If more than one "admin" role is found
      }
    }

    return adminCount === 1; // there's only one admin among the users
  };

  const columns = [
    columnHelper.accessor("firstName", {
      header: "First Name",
    }),
    columnHelper.accessor("lastName", {
      header: "Last name",
    }),
    columnHelper.accessor("email", {
      header: "Email ID",
    }),
    columnHelper.accessor("roles", {
      header: "Roles",
      cell: (info) => {
        return (
          <Styles.InvitedUserTypeLabel>
            {info
              .getValue()
              ?.map((r) => getNewUserTypeLabel(r as TNewUserTypes))
              .join(` , `)}
          </Styles.InvitedUserTypeLabel>
        );
      },
    }),
    columnHelper.accessor("invitationStatus", {
      header: "Status",
      cell: (info) => {
        return getNewUserStatusLabel(info.getValue()?.toLowerCase() as TNewUserStatus);
      },
    }),

    columnHelper.display({
      id: "Actions",
      header: () => {
        return <span style={{ marginLeft: "auto" }}>Actions</span>;
      },
      cell: ({ row }) => {
        const id: string = row.original.id as string;
        const status = row.original.invitationStatus?.toLowerCase() as TNewUserStatus;
        const roles = row.original.roles;
        const hasAdminRole = roles?.includes(UserRoles.superUser);
        const allowRevoke = row.original.email === user?.email;

        return (
          <ActionTooltip
            title={
              <TooltipButtonBox>
                <TooltipButtonActions
                  $disabled={status === UserStatus.onboarded}
                  onClick={() => {
                    // if(status === UserStatus.onboarded) return;
                    onResendInvitation(id);
                  }}
                >
                  Resend Invitation
                </TooltipButtonActions>
                <TooltipButtonActions
                  $disabled={status === UserStatus.cancelled || status === UserStatus.onboarded}
                  onClick={() => onCancelInvitation(id)}
                >
                  Cancel Invitation
                </TooltipButtonActions>
                <TooltipButtonActions
                  $disabled={hasAdminRole && soleAdminUser(users)}
                  onClick={() => onArchiveUser(id)}
                >
                  Archive User
                </TooltipButtonActions>
                <TooltipButtonActions
                  $disabled={roles?.includes(UserRoles.superUser)}
                  onClick={() => onMakeAdmin(id)}
                >
                  Make Admin
                </TooltipButtonActions>
                <TooltipButtonActions
                  $disabled={
                    !roles?.includes(UserRoles.superUser) || soleAdminUser(users) || allowRevoke
                  }
                  onClick={() => onRevokeAdmin(id)}
                >
                  Revoke Admin
                </TooltipButtonActions>
              </TooltipButtonBox>
            }
          />
        );
      },
    }),
  ];

  const table = useReactTable({
    columns,
    data: users,
    getCoreRowModel: getCoreRowModel(),
  });

  return <Table table={table} />;
};
