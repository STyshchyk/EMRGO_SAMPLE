import { FC, useMemo } from "react";

import { clientPrimariesRoutes as routes } from "@emrgo-frontend/constants";
import {
  currencyRenderer,
  Table,
  timeLeftRenderer,
  WatchlistSelectedIcon,
  WatchlistUnselectedIcon,
} from "@emrgo-frontend/shared-ui";
import { IIssuance } from "@emrgo-frontend/types";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { reverse } from "named-urls";

import { DataRoomLink } from "../../../components/DataRoomLink";
import * as Styles from "./IssuanceTable.styles";
import { IIssuanceTableProps } from "./IssuanceTable.types";

const columnHelper = createColumnHelper<IIssuance>();

export const IssuanceTable: FC<IIssuanceTableProps> = ({
  opportunities,
  onToggleIssuanceOnWatchlist,
  onIssuanceClick,
  bankId,
  searchQuery,
  setSearchQuery,
  pageIndex = 0,
  pageSize = 5,
}) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Issuance name",
        enableGlobalFilter: true,
      }),
      columnHelper.accessor("issuer.name", {
        header: "Issuer",
      }),
      columnHelper.accessor("type.name", {
        header: "Type",
      }),
      columnHelper.accessor("currency.name", {
        header: "Currency",
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (props) => `${currencyRenderer(props.getValue()) || ""}`,
      }),
      columnHelper.accessor("return", {
        header: "Return",
        cell: (props) => `${props.getValue() || 0}%`,
      }),
      columnHelper.accessor("tenor", {
        header: "Tenor",
        cell: (props) => `${props.getValue() || ""}`,
      }),
      columnHelper.accessor("isin", {
        header: "ISIN",
      }),
      columnHelper.accessor("status.name", {
        header: "Status",
        cell: ({ row }) => `${row.original.status ? row.original.status.name : ""}`,
      }),

      columnHelper.accessor("timeLeft", {
        header: "Time left",
        cell: (props) => timeLeftRenderer(props.getValue()),
      }),
      columnHelper.display({
        header: "Data room",
        id: "dataRoom",

        cell: ({ row }) => {
          const issuanceId = row?.original.id;
          return (
            <DataRoomLink
              path={reverse(routes.tradeOpportunities.bank.issuances.details.dataRoom, {
                bankId,
                issuanceId,
              })}
            />
          );
        },
      }),
      columnHelper.display({
        id: "watchList",
        cell: ({ row }) => {
          const { id, isWatched } = row.original;

          return (
            <Styles.Action
              onClick={(event) => {
                event.stopPropagation();
                onToggleIssuanceOnWatchlist?.(id);
              }}
              $isToggled={isWatched}
            >
              {isWatched && <WatchlistSelectedIcon />}
              {!isWatched && <WatchlistUnselectedIcon />}
            </Styles.Action>
          );
        },
      }),
    ],
    [onToggleIssuanceOnWatchlist, bankId]
  );

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  // const data = useMemo(() => [...opportunities, mockedOpportunity], [opportunities]);
  const data = useMemo(() => [...opportunities], [opportunities]);

  const table = useReactTable({
    columns,
    data,
    enableFilters: true,
    enableColumnFilters: true,
    globalFilterFn: `includesString`,
    state: {
      globalFilter: searchQuery,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setSearchQuery,
  });

  return (
    <Table
      table={table}
      onRowClick={onIssuanceClick ? (row) => onIssuanceClick?.(row.original, bankId) : undefined}
    />
  );
};
