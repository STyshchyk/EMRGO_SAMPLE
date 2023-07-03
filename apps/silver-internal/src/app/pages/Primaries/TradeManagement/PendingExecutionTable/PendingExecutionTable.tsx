import { FC } from "react";

import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Button, Table } from "@emrgo-frontend/shared-ui";

import { ensureNotNull } from "@emrgo-frontend/utils";

import { DataRoomLink } from "../../components/DataRoomLink";
import { getIssuanceTypeLabel } from "../../helpers";
import { useTradeManagementContext } from "../TradeManagement.provider";
import { IPendingExecutionIssuance } from "../TradeManagement.types";
import { getPendingExecutionStatusLabel } from "./helpers";
import * as Styles from "./PendingExecutionTable.styles";
import { IPendingExecutionTableProps } from "./PendingExecutionTable.types";

const columnHelper = createColumnHelper<IPendingExecutionIssuance>();

const columns = [
  columnHelper.accessor("issuer", {
    header: "Issuer",
  }),
  columnHelper.accessor("type", {
    header: "Type",
    cell: (info) => getIssuanceTypeLabel(info.getValue()),
  }),
  columnHelper.accessor("currency", {
    header: "Currency",
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
  }),
  columnHelper.accessor("return", {
    header: "Return",
  }),
  columnHelper.accessor("tenor", {
    header: "Tenor",
  }),
  columnHelper.accessor("isin", {
    header: "ISIN",
  }),
  columnHelper.accessor("sellSide", {
    header: "Sell-side",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <Styles.PendingExecutionStatusLabel $status={info.getValue()}>
        {getPendingExecutionStatusLabel(info.getValue())}
      </Styles.PendingExecutionStatusLabel>
    ),
  }),
  columnHelper.display({
    header: "Trade ticket",
    id: "tradeTicket",

    cell: ({ row }) => {
      const { status, id } = row.original;
      const { viewTicket } = ensureNotNull(useTradeManagementContext());

      if (status === "pending") {
        return "-";
      }

      return (
        <Button size="small" onClick={() => viewTicket(id)}>
          View Ticket
        </Button>
      );
    },
  }),
  columnHelper.display({
    header: "Data room",
    id: "dataRoom",

    cell: () => {
      return (
        // TODO: Replace with correct path when the data room page is ready
        <DataRoomLink to="/" />
      );
    },
  }),
];

export const PendingExecutionTable: FC<IPendingExecutionTableProps> = ({}) => {
  const { pendingExecution } = ensureNotNull(useTradeManagementContext());
  const table = useReactTable({
    columns,
    data: pendingExecution,
    getCoreRowModel: getCoreRowModel(),
  });

  return <Table table={table} />;
};
