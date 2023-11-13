import { Row, Table } from "@tanstack/react-table";

export interface ITableProps<T> {
  table: Table<T>;
  displayShown?: boolean;
  onRowClick?: (row: Row<T>) => void;
  pagination?: boolean;
}
