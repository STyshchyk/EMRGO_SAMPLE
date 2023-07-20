import { FC } from "react";

import { ActionTooltip, Table, TooltipButtonActions, TooltipButtonBox, useToast } from "@emrgo-frontend/shared-ui";
import { useMutation } from "@tanstack/react-query";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { setStatus } from "../OnboardUser.service";
import { IIvitedUsersTableProps, INewUser } from "./IvitedUsersTable.types";

const columnHelper = createColumnHelper<INewUser>();

export const IvitedUsersTable: FC<IIvitedUsersTableProps> = ({ users }) => {
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
      header: "Second name"
    }),
    columnHelper.accessor("middleName", {
      header: "Middle name"
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
        return (
          <ActionTooltip
            title={
              <TooltipButtonBox>
                <TooltipButtonActions
                  $disabled={true}
                  onClick={() => {
                    doSetStatus({ id: original.id, status: "inactive" });
                  }}
                >
                  Deactivate User
                </TooltipButtonActions>
                <TooltipButtonActions
                  onClick={() => {
                    doSetStatus({ id: original.id, status: "active" });
                  }}
                >
                  Reactivate User
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
