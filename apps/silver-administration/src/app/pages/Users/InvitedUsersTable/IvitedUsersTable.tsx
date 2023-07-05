import { FC } from "react";

import { Table, useToast } from "@emrgo-frontend/shared-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { ActionTooltip } from "@emrgo-frontend/shared-ui";
import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import { getInvitedUserTypeLabel } from "../../helpers";
import { cancelInvitation, removeUser, resendInfo, reset2FA } from "../InviteUser.services";
import { IUserNew } from "../User.types";
import * as Styles from "./IvitedUsersTable.styles";
import { IIvitedUsersTableProps } from "./IvitedUsersTable.types";

const columnHelper = createColumnHelper<IUserNew>();

export const IvitedUsersTable: FC<IIvitedUsersTableProps> = ({ users }) => {
  const { mutate: doCancelInvitation } = useMutation(cancelInvitation);
  const { mutate: doRemoveUser } = useMutation(removeUser);
  const { mutate: doReset2FA } = useMutation(reset2FA);
  const { mutate: doResendInfo } = useMutation(resendInfo);
  const client = useQueryClient();
  const { showErrorToast, showSuccessToast } = useToast();
  const columns = [
    columnHelper.accessor("firstName", {
      header: "First Name"
    }),
    columnHelper.accessor("lastName", {
      header: "Second name"
    }),
    columnHelper.accessor("email", {
      header: "Email ID"
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => {
        // @ts-ignore
        return getInvitedUserTypeLabel(info.getValue());
      }
    }),
    columnHelper.accessor("invitationStatus", {
      header: "Status"
    }),
    columnHelper.display({
      id: "Actions",
      header: () => {
        return <span style={{ marginLeft: "auto" }}>Actions</span>;
      },
      cell: ({ row }) => {
        const id: string = row.original.id as string;
        return (
          <ActionTooltip
            title={
              <Styles.ButtonBox>
                <Styles.ButtonActions
                  onClick={() => {
                    doCancelInvitation(id, {
                      onSuccess: () => {
                        showSuccessToast("Invitation is successfully canceled");
                        client.invalidateQueries([queryKeys.administration.users]).then(() => {
                        });

                      },
                      onError: () => {
                        showErrorToast("Error canceling invitation");
                      }
                    });
                  }}
                >
                  Cancel invitation
                </Styles.ButtonActions>
                <Styles.ButtonActions
                  onClick={() => {
                    console.log("Remove user");
                    doRemoveUser(id, {
                      onSuccess: () => {
                        showSuccessToast("User is successfully removed");
                        client.invalidateQueries([queryKeys.administration.users]).then(() => {
                        });
                      },
                      onError: () => {
                        showErrorToast("Error while trying to remove user");
                      }
                    });
                  }}
                >
                  Remove user
                </Styles.ButtonActions>
                <Styles.ButtonActions
                  onClick={() => {
                    console.log("Reset 2FA");
                    doReset2FA(id, {
                      onSuccess: () => {
                        showSuccessToast("2FA is successfully reset ");
                        client.invalidateQueries([queryKeys.administration.users]).then(() => {
                        });
                      },
                      onError: () => {
                        showErrorToast("Error while trying to Reset 2FA ");
                      }
                    });
                  }}
                >
                  Reset 2FA
                </Styles.ButtonActions>
                <Styles.ButtonActions
                  onClick={() => {
                    console.log("Resend info");
                    doResendInfo(id, {
                      onSuccess: () => {
                        showSuccessToast("Successfully resent invitation info");
                        client.invalidateQueries([queryKeys.administration.users]).then(() => {
                        });
                      },
                      onError: () => {
                        showErrorToast("Error while trying to Resend info");
                      }
                    });
                  }}
                >
                  Resend information
                </Styles.ButtonActions>
              </Styles.ButtonBox>
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
