import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
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
        <div className="flex sm:flex-row flex-col w-full mt-2 items-center gap-5 text-xs justify-end">
          <div className="mb1">
            <span className="mr-2">Rows per page:</span>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={table.getState().pagination.pageSize}
              label="Number"
              style={{ padding: "1px" }}
              sx={{
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                  border: 0,
                },
                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: 0,
                },
              }}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 15, 20].map((pageSize) => (
                <MenuItem key={pageSize} value={pageSize}>
                  {pageSize}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="flex gap-2 items-center">
            <button
              style={{ all: "unset" }}
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <Tooltip title={"First page"}>
                <FirstPageIcon
                  className={`${
                    !table.getCanPreviousPage()
                      ? "text-slate-500"
                      : "hover:bg-gray-100 hover:cursor-pointer"
                  } rounded p-1`}
                />
              </Tooltip>
            </button>
            <button
              style={{ all: "unset" }}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <Tooltip title={"Previous page"}>
                <NavigateBeforeIcon
                  className={`${
                    !table.getCanPreviousPage()
                      ? "text-slate-500"
                      : "hover:bg-gray-100 hover:cursor-pointer"
                  } rounded p-1`}
                />
              </Tooltip>
            </button>
            <span style={{ marginBottom: "4px" }}>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              style={{ all: "unset" }}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <Tooltip title={"Next page"}>
                <NavigateNextIcon
                  className={`${
                    !table.getCanNextPage()
                      ? "text-slate-500"
                      : "hover:bg-gray-100 hover:cursor-pointer  "
                  } rounded p-1`}
                />
              </Tooltip>
            </button>
            <button
              style={{ all: "unset" }}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <Tooltip title={"Last page"}>
                <LastPageIcon
                  className={`${
                    !table.getCanNextPage()
                      ? "text-slate-500"
                      : "hover:bg-gray-100 hover:cursor-pointer  "
                  } rounded p-1`}
                />
              </Tooltip>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
