import { FC } from "react";

import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Button, Table } from "@emrgo-frontend/shared-ui";

import { ensureNotNull } from "@emrgo-frontend/utils";

import { DataRoomLink } from "../../components/DataRoomLink";
import { getIssuanceTypeLabel } from "../../helpers";
import { usePostTradeContext } from "../PostTrade.provider";
import { ICustodyIssuance } from "../PostTrade.types";
import { ICustodyTableProps } from "./CustodyTable.types";

const columnHelper = createColumnHelper<ICustodyIssuance>();

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
  columnHelper.display({
    header: "Custody",
    id: "custody",

    cell: ({ row }) => {
      const { id } = row.original;
      const { viewCustody } = ensureNotNull(usePostTradeContext());

      return (
        <Button size="small" onClick={() => viewCustody(id)}>
          View
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

export const CustodyTable: FC<ICustodyTableProps> = ({}) => {
  const { custody } = ensureNotNull(usePostTradeContext());
  const table = useReactTable({
    columns,
    data: custody,
    getCoreRowModel: getCoreRowModel(),
  });

  return <Table table={table} />;
};
