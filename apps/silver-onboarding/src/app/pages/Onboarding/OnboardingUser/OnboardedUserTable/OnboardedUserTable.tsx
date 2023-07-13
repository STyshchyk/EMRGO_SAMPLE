import { FC } from "react";

import { ActionTooltip, Table, TooltipButtonActions, TooltipButtonBox,useToast} from "@emrgo-frontend/shared-ui";
import { trimDate } from "@emrgo-frontend/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { silverQueryKeys  as queryKeys} from "@emrgo-frontend/constants";
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
      cell: props => props.getValue() ? trimDate(props.getValue()) : "N/A"
    }),
    columnHelper.accessor("entityKycStatus", {
      header: "KYC",
      cell: props => getKycLabel(props.getValue())
    }),
    columnHelper.accessor("entityKycSubmissionDate", {
      header: "KYC TS",
      cell: props => props.getValue() ? trimDate(props.getValue()) : "N/A"
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
        const allowApproveKYC = getKycLabel(getRow.userKycStatus) ;
        const allowApproveCP = getKycLabel(getRow.entityKycStatus) ;

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
                <TooltipButtonActions $disabled={allowApproveCP !== "Submitted"}
                  onClick={() => {

                    if(allowApproveCP !== "Submitted") {showErrorToast(`Error while trying to approve KYC Profile with status ${allowApproveCP}`); return;}

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
                </TooltipButtonActions>
                <TooltipButtonActions $disabled={allowApproveKYC !== "Submitted"}
                  onClick={() => {
                    if(allowApproveKYC !== "Submitted") {showErrorToast(`Error while trying to approve Client Profile with status ${allowApproveKYC}`); return;}
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
    data: onboarderUsers,
    getCoreRowModel: getCoreRowModel()
  });

  return <Table table={table} />;
};