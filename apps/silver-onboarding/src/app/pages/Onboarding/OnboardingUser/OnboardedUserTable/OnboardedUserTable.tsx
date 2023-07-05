import { FC } from "react";

import { ActionTooltip, Table, useToast } from "@emrgo-frontend/shared-ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { queryKeys } from "../../../../constants";
import { getKycLabel, IEntity, kycType } from "../OnboarderUsers/OnboardedUsers.types";
import { kycSubmit } from "../OnboarderUsers/OnboardrdedUsers.service";
import * as Styles from "./OnboardedUserTable.styles";
import { IOnboardedUserTableProps } from "./OnboardedUserTable.types";

const columnHelper = createColumnHelper<IEntity>();

export const OnboardedUserTable: FC<IOnboardedUserTableProps> = ({ onboarderUsers }) => {
  const { showErrorToast, showSuccessToast } = useToast();
  const client = useQueryClient();
  const { mutate: doKycSumbit } = useMutation(kycSubmit, {
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [queryKeys.onboarding.fetch] }).then(() => {
      });
    }
  });

  const columns = [
    columnHelper.accessor("firstName", {
      header: "First Name"
    }),
    columnHelper.accessor("lastName", {
      header: "Second name"
    }),
    columnHelper.accessor("entityName", {
      header: "Entity Name"
    }),
    columnHelper.accessor("email", {
      header: "Email ID"
    }),
    columnHelper.accessor("userKycStatus", {
      header: "Client Profile",
      cell: props => getKycLabel(props.getValue())
    }),
    columnHelper.accessor("userKycSubmissionDate", {
      header: "Client Profile TS",
      cell: props => props.getValue() || "n/a"
    }),
    columnHelper.accessor("entityKycStatus", {
      header: "KYC",
      cell: props => getKycLabel(props.getValue())
    }),
    columnHelper.accessor("entityKycSubmissionDate", {
      header: "KYC TS",
      cell: props => props.getValue() || "n/a"
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
        return (
          <ActionTooltip
            title={
              <Styles.ButtonBox>
                <Styles.ButtonActions
                  onClick={() => {
                    window.open("https://admin.typeform.com/login");
                  }}
                >
                  Open Typeform
                </Styles.ButtonActions>
                <Styles.ButtonActions
                  onClick={() => {
                    doKycSumbit({
                      id: entityId,
                      isApproved: true,
                      kycType: kycType.entity
                    }, {
                      onError: () => {
                        showErrorToast("Error while trying to approve KYC Profile");
                      }
                    });
                  }}
                >
                  Approve KYC
                </Styles.ButtonActions>
                <Styles.ButtonActions
                  onClick={() => {
                    doKycSumbit({
                      id: userId,
                      isApproved: true,
                      kycType: kycType.user
                    }, {
                      onError: () => {
                        showErrorToast("Error while trying to approve Client Profile");
                      }
                    });
                  }}
                >
                  Approve Client Profile
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
    data: onboarderUsers,
    getCoreRowModel: getCoreRowModel()
  });

  return <Table table={table} />;
};
