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
        <div className="flex sm:flex-row flex-col w-full mt-8 items-start gap-2 text-xs justify-end">
          <div className="sm:mb-0 mb-2">
            <span className="mr-2">Items</span>
            <select
              className="border p-1 rounded w-16 border-white-200 bg-white text-gray-700"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 15, 20].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              className={`${
                !table.getCanPreviousPage()
                  ? "bg-white"
                  : "hover:bg-gray-200 hover:cursor-pointer bg-gray-100"
              } rounded p-1`}
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="w-5 h-5 text-gray-950">{"<<"}</span>
            </button>
            <button
              className={`${
                !table.getCanPreviousPage()
                  ? "bg-white"
                  : "hover:bg-gray-200 hover:cursor-pointer bg-gray-100"
              } rounded p-1`}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="w-5 h-5 text-gray-950">{"<"}</span>
            </button>
            <span className="flex items-center gap-1">
              <input
                min={1}
                max={table.getPageCount()}
                type="number"
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-10 bg-white text-gray-700"
              />
              of {table.getPageCount()}
            </span>
            <button
              className={`${
                !table.getCanNextPage()
                  ? "bg-white"
                  : "hover:bg-gray-200 hover:cursor-pointer bg-gray-100"
              } rounded p-1`}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="w-5 h-5 text-gray-950">{">"}</span>
            </button>
            <button
              className={`${
                !table.getCanNextPage()
                  ? "bg-white"
                  : "hover:bg-gray-200 hover:cursor-pointer bg-gray-100"
              } rounded p-1`}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="w-5 h-5 text-gray-950">{">>"}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
