import { useNavigate } from "react-router-dom";

import {
  ActionTooltip,
  currencyRenderer,
  Table,
  TooltipButtonActions,
  TooltipButtonBox,
  useToast,
} from "@emrgo-frontend/shared-ui";
import { IOpportunityFetch } from "@emrgo-frontend/types";
import { useQueryClient } from "@tanstack/react-query";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { CountdownTimer } from "../../components/CountdownTimer";
import { getOpportunityStatusLabel } from "../../helpers";
import { useTradeInterestModal, useTradeOpportunitiesStore } from "../../store";
import { IExecutedTableProps } from "./ExecutedTable.types";

const columnHelper = createColumnHelper<IOpportunityFetch>();

export const ExecutedTable = ({ opportunities }: IExecutedTableProps) => {
  const { modalActions } = useTradeOpportunitiesStore();
  const { modalActions: tradeActions } = useTradeInterestModal();
  const client = useQueryClient();
  const { showErrorToast } = useToast();
  const navigate = useNavigate();

  const columns = [
    columnHelper.accessor("name", {
      header: "Issuance name",
    }),
    columnHelper.accessor("issuer.name", {
      header: "Issuer",
    }),
    columnHelper.accessor("type.name", {
      header: "Type",
      cell: ({ row }) => `${row.original.type?.name ?? "n/a"}`,
    }),
    columnHelper.accessor("currency.name", {
      header: "Currency",
      cell: (props) => `${props?.getValue() || "n/a"}`,
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (props) => `${currencyRenderer(props.getValue()) || "n/a"}`,
    }),
    columnHelper.accessor("return", {
      header: "Return",
      cell: (props) => `${props?.getValue() || 0}%`,
    }),
    columnHelper.accessor("tenor", {
      cell: (props) => (props.getValue() ? `${props?.getValue()} years` : "n/a"),
    }),
    columnHelper.accessor("isin", {
      header: "ISIN",
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        return `${getOpportunityStatusLabel(row.original?.statusId) ?? "N/A"}`;
      },
    }),
    columnHelper.accessor("timeLeft", {
      header: "Time left",
      // TODO : Replace with countown time
      cell: (props) => <CountdownTimer date={props.getValue()} />,
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
      },
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
                <TooltipButtonActions onClick={() => {}}>
                  View Trade Notification
                </TooltipButtonActions>
                <TooltipButtonActions onClick={() => {}}>Create Trade Ticket</TooltipButtonActions>
                <TooltipButtonActions onClick={() => {}}>
                  Upload Sell-side Trade Evidence
                </TooltipButtonActions>
                <TooltipButtonActions onClick={() => {}}>
                  View Sell-side Trade Evidence
                </TooltipButtonActions>
                <TooltipButtonActions onClick={() => {}}>View Trade Ticket</TooltipButtonActions>

                <TooltipButtonActions onClick={() => {}}>Cancel Trade Ticket</TooltipButtonActions>
              </TooltipButtonBox>
            }
          ></ActionTooltip>
        );
      },
    }),
  ];

  const table = useReactTable({
    columns,
    data: opportunities,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table
      table={table}
      // onRowClick={(row) => console.log(row)}
      displayShown={true}
    />
  );
};
