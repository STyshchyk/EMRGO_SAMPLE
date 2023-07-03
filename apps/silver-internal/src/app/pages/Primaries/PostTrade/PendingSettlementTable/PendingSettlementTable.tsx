import { FC } from "react";

import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Button, Table } from "@emrgo-frontend/shared-ui";

import { ensureNotNull } from "@emrgo-frontend/utils";

import { DataRoomLink } from "../../components/DataRoomLink";
import { getIssuanceTypeLabel } from "../../helpers";
import { usePostTradeContext } from "../PostTrade.provider";
import { IPendingSettlementIssuance } from "../PostTrade.types";
import { getPendingSettlementStatusLabel } from "./helpers";
import * as Styles from "./PendingSettlementTable.styles";
import { IPendingSettlementTableProps } from "./PendingSettlementTable.types";

const columnHelper = createColumnHelper<IPendingSettlementIssuance>();

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
  columnHelper.accessor("custodian", {
    header: "Custodian",
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <Styles.PendingSettlementStatusLabel $status={info.getValue()}>
        {getPendingSettlementStatusLabel(info.getValue())}
      </Styles.PendingSettlementStatusLabel>
    ),
  }),
  columnHelper.display({
    header: "Instructions",
    id: "instructions",

    cell: ({ row }) => {
      const { id } = row.original;
      const { viewPayment } = ensureNotNull(usePostTradeContext());

      return (
        <Button size="small" onClick={() => viewPayment(id)}>
          Payment
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

export const PendingSettlementTable: FC<IPendingSettlementTableProps> = ({}) => {
  const { pendingSettlement } = ensureNotNull(usePostTradeContext());
  const table = useReactTable({
    columns,
    data: pendingSettlement,
    getCoreRowModel: getCoreRowModel(),
  });

  return <Table table={table} />;
};
