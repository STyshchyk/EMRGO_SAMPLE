import { FC } from "react";

import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, WatchlistSelectedIcon } from "@emrgo-frontend/shared-ui";

import { ensureNotNull } from "@emrgo-frontend/utils";

import { DataRoomLink } from "../../../components/DataRoomLink";
import { OpportunityStatusLabel } from "../../../components/OpportunityStatusLabel";
import { getIssuanceTypeLabel } from "../../../utils/helpers";
import { useTradeManagementContext } from "../TradeManagement.provider";
import { IWatchlistIssuance } from "../TradeManagement.types";
import * as Styles from "./WatchlistTable.styles";
import { IWatchlistTableProps } from "./WatchlistTable.types";

const columnHelper = createColumnHelper<IWatchlistIssuance>();

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
  columnHelper.accessor("timeLeft", {
    header: "Time left",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <OpportunityStatusLabel status={info.getValue()} />,
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
  columnHelper.display({
    id: "watchList",
    cell: ({ row }) => {
      const { id } = row.original;
      const { removeFromWatchlist } = ensureNotNull(useTradeManagementContext());

      return (
        <Styles.Action onClick={() => removeFromWatchlist(id)}>
          <WatchlistSelectedIcon />
        </Styles.Action>
      );
    },
  }),
];

export const WatchlistTable: FC<IWatchlistTableProps> = ({}) => {
  const { watchlist } = ensureNotNull(useTradeManagementContext());
  const table = useReactTable({
    columns,
    data: watchlist,
    getCoreRowModel: getCoreRowModel(),
  });

  return <Table table={table} />;
};
