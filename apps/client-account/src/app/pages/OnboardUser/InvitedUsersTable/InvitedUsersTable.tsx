import { FC } from "react";

import { ActionTooltip, Table, TooltipButtonActions, TooltipButtonBox, useToast } from "@emrgo-frontend/shared-ui";
import { useMutation } from "@tanstack/react-query";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { setStatus } from "../EntityManagement.service";
import { IInvitedUsersTableProps, INewUser } from "./InvitedUsersTable.types";

const columnHelper = createColumnHelper<INewUser>();

export const InvitedUsersTable: FC<IInvitedUsersTableProps> = ({ users }) => {
  const { showErrorToast, showSuccessToast } = useToast();

  const { mutate: doSetStatus } = useMutation({
    mutationFn: setStatus,
    onError: () => {
      showErrorToast("Error while setting status");
    }
  });
  const columns = [
    columnHelper.accessor("firstName", {
      header: "First Name"
    }),
    columnHelper.accessor("lastName", {
      header: "Last name"
    }),
    columnHelper.accessor("email", {
      header: "Email ID"
    }),
    columnHelper.accessor("role", {
      header: "Role"
    }),
    columnHelper.display({
      id: "Actions",
      header: () => {
        return <span style={{ marginLeft: "auto" }}>Actions</span>;
      },
      cell: ({ row }) => {
        const { original } = row;
        const id = original.id ?? "";
        return (
          <ActionTooltip
            title={
              <TooltipButtonBox>
                <TooltipButtonActions
                  $disabled={true}
                  onClick={() => console.log('click')}
                >
                  Resend Invitation
                </TooltipButtonActions>
                <TooltipButtonActions
                  onClick={() => console.log('click')}
                >
                  Cancel Invitation
                </TooltipButtonActions>
                <TooltipButtonActions
                  onClick={() => console.log('click')}
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
