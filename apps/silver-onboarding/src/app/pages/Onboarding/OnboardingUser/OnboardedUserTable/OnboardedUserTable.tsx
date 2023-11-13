import React, { FC } from "react";

import { silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import {
  ActionTooltip,
  Table,
  TooltipButtonActions,
  TooltipButtonBox,
  useToast,
} from "@emrgo-frontend/shared-ui";
import { trimDate } from "@emrgo-frontend/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { getKycLabel, IEntity, kycType } from "../OnboarderUsers/OnboardedUsers.types";
import { kycSubmit } from "../OnboarderUsers/OnboardrdedUsers.service";
import { IOnboardedUserTableProps } from "./OnboardedUserTable.types";

const columnHelper = createColumnHelper<IEntity>();

export const OnboardedUserTable: FC<IOnboardedUserTableProps> = ({ onboardedUsers }) => {
  const { showErrorToast, showSuccessToast } = useToast();
  const client = useQueryClient();
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "firstName",
      desc: true,
    },
  ]);
  const { mutate: doKycSumbit } = useMutation(kycSubmit, {
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [queryKeys.onboarding.fetch] }).then(() => {});
    },
  });

  const columns = [
    columnHelper.accessor("firstName", {
      header: "First Name",
    }),
    columnHelper.accessor("lastName", {
      header: "Second name",
    }),
    columnHelper.accessor("entityName", {
      header: "Entity Name",
    }),
    columnHelper.accessor("email", {
      header: "Email ID",
    }),
    columnHelper.accessor("userKycStatus", {
      header: "Client Profile",
      cell: (props) => getKycLabel(props.getValue()),
    }),
    columnHelper.accessor("userKycSubmissionDate", {
      header: "Client Profile TS",
      cell: (props) => (props.getValue() ? trimDate(props.getValue()) : "N/A"),
    }),
    columnHelper.accessor("entityKycStatus", {
      header: "KYC",
      cell: (props) => getKycLabel(props.getValue()),
    }),
    columnHelper.accessor("entityKycSubmissionDate", {
      header: "KYC TS",
      cell: (props) => (props.getValue() ? trimDate(props.getValue()) : "N/A"),
    }),
    // columnHelper.accessor("entityCustodyKycStatus", {
    //   header: "Custody KYC",
    //   cell: (props) => getKycLabel(props.getValue()),
    // }),
    columnHelper.accessor("hasAcceptedClientTerms", {
      header: "Custody Terms",
      cell: (props) => (props.getValue() ? "Accepted" : "Pending"),
    }),
    // timestamp for when client terms is accepted
    columnHelper.accessor("entityCustodyKycSubmissionDate", {
      header: "Custody Terms TS",
      cell: (props) => (props.getValue() ? trimDate(props.getValue()) : "N/A"),
    }),
    columnHelper.display({
      id: "Actions",
      header: () => {
        return <span style={{ marginLeft: "auto" }}>Actions</span>;
      },
      cell: ({ row }) => {
        const getRow = row.original;
        const userId = getRow.userId;
        const entityId = getRow.entityId;
        const allowApproveCP = getKycLabel(getRow.userKycStatus); // client profile
        const allowApproveKYC = getKycLabel(getRow.entityKycStatus); // kyc
        const allowApproveCustody = getKycLabel(getRow.entityCustodyKycStatus);

        return (
          <ActionTooltip
            title={
              <TooltipButtonBox>
                <TooltipButtonActions
                  onClick={() => {
                    window.open("https://admin.typeform.com/login");
                  }}
                >
                  Open Typeform
                </TooltipButtonActions>
                <TooltipButtonActions
                  $disabled={allowApproveKYC !== "Submitted"}
                  onClick={() => {
                    if (allowApproveKYC !== "Submitted") {
                      showErrorToast(
                        `Error while trying to approve KYC Profile with status ${allowApproveKYC}`
                      );
                      return;
                    }

                    doKycSumbit(
                      {
                        id: entityId,
                        isApproved: true,
                        kycType: kycType.entity,
                      },
                      {
                        onError: () => {
                          showErrorToast("Error while trying to approve KYC Profile");
                        },
                        onSuccess: () => {
                          showSuccessToast("Successfully approved KYC Profile");
                        },
                      }
                    );
                  }}
                >
                  Approve KYC
                </TooltipButtonActions>
                <TooltipButtonActions
                  $disabled={allowApproveCP !== "Submitted"}
                  onClick={() => {
                    if (allowApproveCP !== "Submitted") {
                      showErrorToast(
                        `Error while trying to approve Client Profile with status ${allowApproveCP}`
                      );
                      return;
                    }
                    doKycSumbit(
                      {
                        id: userId,
                        isApproved: true,
                        kycType: kycType.user,
                      },
                      {
                        onError: () => {
                          showErrorToast("Error while trying to approve Client Profile");
                        },
                        onSuccess: () => {
                          showSuccessToast("Successfully approved Client Profile");
                        },
                      }
                    );
                  }}
                >
                  Approve Client Profile
                </TooltipButtonActions>

                <TooltipButtonActions
                  // $disabled={allowApproveCustody !== "Submitted"}
                  $disabled={true}
                  onClick={() => {
                    if (allowApproveCustody !== "Submitted") {
                      showErrorToast(
                        `Error while trying to approve Client Profile with status ${allowApproveKYC}`
                      );
                      return;
                    }
                    doKycSumbit(
                      {
                        id: entityId,
                        isApproved: true,
                        kycType: kycType.entityCustody,
                      },
                      {
                        onError: () => {
                          showErrorToast("Error while trying to approve Custody KYC");
                        },
                        onSuccess: () => {
                          showSuccessToast("Successfully approved Custody KYC");
                        },
                      }
                    );
                  }}
                >
                  Approve Custody KYC
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
    data: onboardedUsers,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    debugTable: true,
  });
  return <Table table={table} pagination={true} />;
};
