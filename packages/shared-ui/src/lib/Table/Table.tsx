import { flexRender } from "@tanstack/react-table";

import { ChevronDownIcon, ChevronUpIcon } from "../Icons";
import * as Styles from "./Table.styles";
import { ITableProps } from "./Table.types";

export const Table = function <T>({ table, onRowClick, displayShown }: ITableProps<T>) {
  return (
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
                      desc: <ChevronDownIcon />
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
  );
};
