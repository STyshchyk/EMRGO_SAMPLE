import { FC } from "react";

import { ActionTooltip, Table, TooltipButtonActions, TooltipButtonBox } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { useEntityManagementContext } from "../EntityManagement.provider";
import { INewUser, TNewUserStatus,TNewUserTypes } from "../EntityManagement.types";
import { getNewUserStatusLabel,getNewUserTypeLabel } from "../helpers";
import * as Styles from './InvitedUsersTable.styles';
import { IInvitedUsersTableProps } from "./InvitedUsersTable.types";

const columnHelper = createColumnHelper<INewUser>();

export const InvitedUsersTable: FC<IInvitedUsersTableProps> = ({ users }) => {

  const {onArchiveUser, onCancelInvitation, onResendInvitation} = ensureNotNull(useEntityManagementContext())
  
  const columns = [
    columnHelper.accessor("firstName", {
      header: "First Name"
    }),
    columnHelper.accessor("lastName", {
      header: "Last name"
    }),
    columnHelper.accessor("email", {
      header: "Email ID",
    }),
    columnHelper.accessor("roles", {
      header: "Roles",
      cell: (info) => {
         return (
          <Styles.InvitedUserTypeLabel>
            {info.getValue().map((r)=> getNewUserTypeLabel(r as TNewUserTypes)).join(` , `)}
          </Styles.InvitedUserTypeLabel>
         )
      },
    }),
    columnHelper.accessor("invitationStatus", {
      header: "Status",
      cell: (info) => {
        return getNewUserStatusLabel(info.getValue()?.toLowerCase() as TNewUserStatus)
     },
    }),

    columnHelper.display({
      id: "Actions",
      header: () => {
        return <span style={{ marginLeft: "auto" }}>Actions</span>;
      },
      cell: ({ row }) => {
        const id: string = row.original.id as string;
        const status = row.original.invitationStatus?.toLowerCase(); 
        return (
          <ActionTooltip
            title={
              <TooltipButtonBox>
                <TooltipButtonActions
                  $disabled={status === 'onboarded'}
                  onClick={() => onResendInvitation(id)}
                >
                  Resend Invitation
                </TooltipButtonActions>
                <TooltipButtonActions
                  $disabled={status === 'cancelled' || status === 'onboarded'}
                  onClick={() => onCancelInvitation(id)}
                >
                  Cancel Invitation
                </TooltipButtonActions>
                <TooltipButtonActions
                  onClick={() => onArchiveUser(id)}
                >
                  Archive User
                </TooltipButtonActions>
              </TooltipButtonBox>
              
            }
          />
        );
      }
    })
  ];

  const table = useReactTable({
    columns,
    data: users,
    getCoreRowModel: getCoreRowModel()
  });

  return <Table table={table} />;
};
