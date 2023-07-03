import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { render } from "@testing-library/react";

import { Table } from "./Table";

test("Table", () => {
  const table = useReactTable({ data: [], columns: [], getCoreRowModel: getCoreRowModel() });
  render(<Table table={table} />);
});
