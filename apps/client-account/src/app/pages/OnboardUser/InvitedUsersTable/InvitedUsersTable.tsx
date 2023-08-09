import { FC } from "react";

import { ActionTooltip, Table, TooltipButtonActions, TooltipButtonBox, useToast } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { useMutation } from "@tanstack/react-query";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { useEntityManagementContext } from "../EntityManagement.provider";
import { INewUser, TNewUserTypes } from "../EntityManagement.types";
import { getNewUserTypeLabel } from "../helpers";
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
            {info.getValue().map((r)=> getNewUserTypeLabel(r)).join(`  ,  `)}
          </Styles.InvitedUserTypeLabel>
         )
      },
    }),
    columnHelper.accessor("invitationStatus", {
      header: "Status",
    }),
    columnHelper.display({
      id: "Actions",
      header: () => {
        return <span style={{ marginLeft: "auto" }}>Actions</span>;
      },
      cell: ({ row }) => {
        const id: string = row.original.id as string;
        const status = row.original.invitationStatus; 
        return (
          <ActionTooltip
            title={
              <TooltipButtonBox>
                <TooltipButtonActions
                  $disabled={status === 'Onboarded'}
                  onClick={() => onResendInvitation(id)}
                >
                  Resend Invitation
                </TooltipButtonActions>
                <TooltipButtonActions
                  $disabled={status === 'Canceled' || status === 'Onboarded'}
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
