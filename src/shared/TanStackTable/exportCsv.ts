import type { ReactTable, RowData } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/shared/TanStackTable/features";

function toCsvField(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text =
    value instanceof Date
      ? value.toISOString()
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

// Writes the records the table shows now (after filters and sorting) for every
// column that reads data, then downloads them. Cells keep their raw values,
// not what a custom cell renderer draws.
export function exportTableToCsv<TData extends RowData>(
  table: ReactTable<DataTableFeatures, TData>,
  fileName: string,
) {
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.accessorFn !== undefined);

  const header = columns.map((column) => {
    const definition = column.columnDef;
    const label =
      definition.meta?.exportLabel ??
      (typeof definition.header === "string" ? definition.header : column.id);
    return toCsvField(label);
  });

  // With grouping, write each group's records in order, open or not; group
  // rows themselves are not records.
  const records = table
    .getSortedRowModel()
    .rows.flatMap((row) => (row.getIsGrouped() ? row.subRows : [row]));

  const lines = records.map((row) =>
    columns.map((column) => toCsvField(row.getValue(column.id))).join(","),
  );

  // The byte order mark lets Excel read UTF-8, so Telugu and other scripts
  // open correctly.
  const csv = "﻿" + [header.join(","), ...lines].join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName.endsWith(".csv") ? fileName : `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
