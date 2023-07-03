import { FC } from "react";

import { Button, Table } from "@emrgo-frontend/shared-ui";
import { ensureNotNull } from "@emrgo-frontend/utils";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { DataRoomLink } from "../../../components/DataRoomLink";
import { getIssuanceTypeLabel } from "../../../utils/helpers";
import { useTradeManagementContext } from "../TradeManagement.provider";
import { IExecutedIssuance } from "../TradeManagement.types";
import { IExecutedTableProps } from "./ExecutedTable.types";

const columnHelper = createColumnHelper<IExecutedIssuance>();

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
  columnHelper.display({
    header: "Post Trade",
    id: "postTrade",

    cell: ({ row }) => {
      const { id } = row.original;
      const { proceed } = ensureNotNull(useTradeManagementContext());

      return (
        <Button size="small" onClick={() => proceed(id)}>
          Proceed
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

export const ExecutedTable: FC<IExecutedTableProps> = ({}) => {
  const { executed } = ensureNotNull(useTradeManagementContext());
  const table = useReactTable({
    columns,
    data: executed,
    getCoreRowModel: getCoreRowModel(),
  });

  return <Table table={table} />;
};
