import React from "react";

import TablePagination from "@mui/material/TablePagination";
import { flexRender } from "@tanstack/react-table";

import { ChevronDownIcon, ChevronUpIcon } from "../Icons";
import * as Styles from "./Table.styles";
import { ITableProps } from "./Table.types";

export const Table = function <T>({
  table,
  onRowClick,
  displayShown,
  pagination = false,
}: ITableProps<T>) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    table.setPageIndex(newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    table.setPageSize(Number(parseInt(event.target.value, 10)));
    setPage(0);
  };
  return (
    <>
      <Styles.Table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Styles.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Styles.Th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <Styles.HeaderCell
                      $canSort={header.column.getCanSort()}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <Styles.Chevron>
                        {{
                          asc: <ChevronUpIcon />,
                          desc: <ChevronDownIcon />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </Styles.Chevron>
                    </Styles.HeaderCell>
                  )}
                </Styles.Th>
              ))}
            </Styles.Tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <Styles.Tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              $isClickable={Boolean(onRowClick)}
              $isRowShow={displayShown && !row.original["isShown" as keyof T]}
            >
              {row.getVisibleCells().map((cell) => (
                <Styles.Td key={cell.id}>
                  <Styles.Cell>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Styles.Cell>
                </Styles.Td>
              ))}
            </Styles.Tr>
          ))}
        </tbody>
      </Styles.Table>
      {pagination && (
        <TablePagination
          className="mt-2"
          component="div"
          count={table.getFilteredRowModel().rows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 15, 20]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          showFirstButton
          showLastButton
        />
      )}
    </>
  );
};
