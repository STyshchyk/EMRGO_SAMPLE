import { useNavigate } from "react-router-dom";

import { silverPrimariesRoutes, silverQueryKeys as queryKeys } from "@emrgo-frontend/constants";
import {
  ActionTooltip,
  currencyRenderer,
  Table,
  TooltipButtonActions,
  TooltipButtonBox,
  useToast
} from "@emrgo-frontend/shared-ui";
import { IOpportunityFetch } from "@emrgo-frontend/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { reverse } from "named-urls";

import { CountdownTimer } from "../../components/CountdownTimer";
import { getOpportunityStatusLabel } from "../../helpers";
import { useOpportunityStore, useTradeInterestModal, useTradeOpportunitiesStore } from "../../store";
import { TShown } from "@emrgo-frontend/types";
import { showOpportunity } from "@emrgo-frontend/services";
import { IIssuanceTableProps } from "./IssuanceTable.types";

const columnHelper = createColumnHelper<IOpportunityFetch>();

export const IssuanceTable = ({ opportunities }: IIssuanceTableProps) => {
  const { modalActions } = useTradeOpportunitiesStore();
  const { modalActions: tradeActions } = useTradeInterestModal();
  const client = useQueryClient();
  const { showErrorToast } = useToast();
  const navigate = useNavigate();
  const setOportunityInfo = useOpportunityStore((state) => state.opportunityAction);
  const { mutate: setShownOpportunity } = useMutation(showOpportunity, {
    onSuccess: () => {
      client.invalidateQueries([queryKeys.primaries.tradeOpportunities.fetch]).then(() => {
      });
    },
    onError: () => {
      showErrorToast("Error setting status for Opportunity");
    }
  });

  const columns = [
    columnHelper.accessor("name", {
      header: "Issuance name"
    }),
    columnHelper.accessor("issuer.name", {
      header: "Issuer"
    }),
    columnHelper.accessor("type.name", {
      header: "Type",
      cell: ({ row }) => `${row.original.type?.name ?? "n/a"}`
    }),
    columnHelper.accessor("currency.name", {
      header: "Currency",
      cell: (props) => `${props?.getValue() || "n/a"}`
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (props) => `${currencyRenderer(props.getValue()) || "n/a"}`
    }),
    columnHelper.accessor("return", {
      header: "Return",
      cell: (props) => `${props?.getValue() || 0}%`
    }),
    columnHelper.accessor("tenor", {
      cell: (props) => (props.getValue() ? `${props?.getValue()} years` : "n/a")
    }),
    columnHelper.accessor("isin", {
      header: "ISIN"
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        return `${getOpportunityStatusLabel(row.original?.statusId) ?? "N/A"}`;
      }
    }),
    columnHelper.accessor("timeLeft", {
      header: "Time left",
      // TODO : Replace with countown time
      cell: (props) => <CountdownTimer date={props.getValue()} />
      // cell: (props) => `${props.getValue() || "n/a"}`
    }),
    columnHelper.display({
      header: "Data room",
      id: "dataRoom",
      cell: ({ row }) => {
        return (
          // TODO: FIX NAVIGATE MODULE
          <span>|</span>
          // <DataRoomLink
          //   onClick={() => {
          //     setOportunityInfo.setOpportunityDocs(row.original);
          //   }}
          // />
        );
      }
    }),
    columnHelper.display({
      id: "Actions",
      header: () => {
        return <span style={{ marginLeft: "auto" }}>Actions</span>;
      },
      cell: ({ row }) => {
        const rowData = row.original;

        return (
          <ActionTooltip
            title={
              <TooltipButtonBox>
                <TooltipButtonActions
                  onClick={() => {
                    modalActions.setModalOpen(true);
                    if (modalActions.setModifyData) {
                      modalActions.setModifyData(rowData);
                    }
                  }}
                >
                  Modify Opportunity
                </TooltipButtonActions>
                <TooltipButtonActions
                  $disabled={!rowData.isShown
                  }
                  onClick={() => {
                    if (!rowData.isShown) return;
                    setShownOpportunity({
                      id: rowData.id,
                      status: TShown.hide
                    });
                  }}
                >
                  Deactivate Opportunity
                </TooltipButtonActions>
                <TooltipButtonActions
                  $disabled={rowData.isShown
                  }
                  onClick={() => {
                    if (rowData.isShown) return;
                    setShownOpportunity({
                      id: rowData.id,
                      status: TShown.show
                    });
                  }}
                >
                  Activate Opportunity
                </TooltipButtonActions>
                <TooltipButtonActions
                  onClick={() => {
                    if (tradeActions.setOpportunityData)
                      tradeActions.setOpportunityData(rowData);

                    tradeActions.setModalOpen(true);
                  }}
                >
                  Create Trade Interest
                </TooltipButtonActions>
                <TooltipButtonActions
                  onClick={() => {
                    if (tradeActions.setOpportunityData) {
                      tradeActions.setOpportunityData(rowData);
                      navigate(reverse(`${silverPrimariesRoutes.primaries.tradeOpportunity.details.home}`, { opportunityId: `${rowData.id}` }));
                    }
                  }}
                >
                  View Trade Interest
                </TooltipButtonActions>
                {/*<Styles.ButtonActions*/}
                {/*  onClick={() => {*/}
                {/*    //TODO : ADD delete API*/}
                {/*  }}>*/}
                {/*  Delete Opportunity*/}
                {/*</Styles.ButtonActions>*/}
              </TooltipButtonBox>
            }
          ></ActionTooltip>
        );
      }
    })
  ];

  const table = useReactTable({
    columns,
    data: opportunities,
    getCoreRowModel: getCoreRowModel()

  });

  return (
    <Table
      table={table}
      // onRowClick={(row) => console.log(row)}
      displayShown={true}
    />
  );
};
