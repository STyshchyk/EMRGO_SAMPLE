import { useNavigate } from "react-router-dom";

import { Span, Table, useToast } from "@emrgo-frontend/shared-ui";
import { useQueryClient } from "@tanstack/react-query";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { ITradeInterestFetch } from "../TradeInterestModal/TradeInterest.types";
import { ITradeInterestTableProps } from "./TradeInterestTable.types";

const columnHelper = createColumnHelper<ITradeInterestFetch>();

export const TradeInterestTable = ({ tradeInterest }: ITradeInterestTableProps) => {
  const client = useQueryClient();
  const { showErrorToast } = useToast();
  const navigate = useNavigate();

  const columns = [
    columnHelper.accessor("id", {
      header: "Opportunity Id",
    }),
    columnHelper.accessor("firstName", {
      header: "Full Name",
      cell: ({ row }) => {
        return `${row.original.firstName} ${row.original.lastName}`;
      },
    }),
    columnHelper.accessor("email", {
      header: "User Id",
    }),
    columnHelper.accessor("detail", {
      header: "Details",
      maxSize: 200,
      cell: ({ cell }) => {
        return <Span $width={400}>{cell.getValue()}</Span>;
      },
    }),
  ];
  const table = useReactTable({
    columns,
    data: tradeInterest,
    getCoreRowModel: getCoreRowModel(),
  });
  return <Table table={table} />;
};
