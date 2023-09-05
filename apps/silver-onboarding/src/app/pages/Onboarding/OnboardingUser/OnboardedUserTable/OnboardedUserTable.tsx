import React, {FC} from "react";

import {silverQueryKeys as queryKeys} from "@emrgo-frontend/constants";
import {
  ActionTooltip,
  Table,
  TooltipButtonActions,
  TooltipButtonBox,
  useToast,
} from "@emrgo-frontend/shared-ui";
import {trimDate} from "@emrgo-frontend/utils";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {
  createColumnHelper, ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {getKycLabel, IEntity, kycType} from "../OnboarderUsers/OnboardedUsers.types";
import {kycSubmit} from "../OnboarderUsers/OnboardrdedUsers.service";
import * as Styles from "./OnboardedUserTable.styles";
import {IOnboardedUserTableProps} from "./OnboardedUserTable.types";
import {SortingTableState} from "@tanstack/table-core/src/features/Sorting";

const columnHelper = createColumnHelper<IEntity>();

export const OnboardedUserTable: FC<IOnboardedUserTableProps> = ({onboarderUsers}) => {
  const {showErrorToast, showSuccessToast} = useToast();
  const client = useQueryClient();
  const [sorting, setSorting] = React.useState<SortingState>([])
  const {mutate: doKycSumbit} = useMutation(kycSubmit, {
    onSuccess: () => {
      client.invalidateQueries({queryKey: [queryKeys.onboarding.fetch]}).then(() => {
      });
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
    columnHelper.accessor("entityCustodyKycStatus", {
      header: "Custody KYC",
      cell: (props) => getKycLabel(props.getValue()),
    }),
    columnHelper.accessor("entityCustodyKycSubmissionDate", {
      header: "Custody KYC TS",
      cell: (props) => (props.getValue() ? trimDate(props.getValue()) : "N/A"),
    }),
    columnHelper.display({
      id: "Actions",
      header: () => {
        return <span style={{marginLeft: "auto"}}>Actions</span>;
      },
      cell: ({row}) => {
        const getRow = row.original;
        const userId = getRow.userId;
        const entityId = getRow.entityId;
        const allowApproveKYC = getKycLabel(getRow.userKycStatus);
        const allowApproveCP = getKycLabel(getRow.entityKycStatus);
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
                  $disabled={allowApproveCP !== "Submitted"}
                  onClick={() => {
                    if (allowApproveCP !== "Submitted") {
                      showErrorToast(
                        `Error while trying to approve KYC Profile with status ${allowApproveCP}`
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
                      }
                    );
                  }}
                >
                  Approve KYC
                </TooltipButtonActions>
                <TooltipButtonActions
                  $disabled={allowApproveKYC !== "Submitted"}
                  onClick={() => {
                    if (allowApproveKYC !== "Submitted") {
                      showErrorToast(
                        `Error while trying to approve Client Profile with status ${allowApproveKYC}`
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
                      }
                    );
                  }}
                >
                  Approve Client Profile
                </TooltipButtonActions>
                <TooltipButtonActions
                  $disabled={allowApproveCustody !== "Submitted"}
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
    data: onboarderUsers,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    initialState: {
      sorting: [{
        id: "firstName",
        desc: true
      }]
    }
  });
  return <Table table={table}/>;
};
