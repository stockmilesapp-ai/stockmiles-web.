import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnGroupingFeature,
  createColumnHelper,
  createExpandedRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createGroupedRowModel,
  createSortedRowModel,
  metaHelper,
  rowExpandingFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  type RowData,
} from "@tanstack/react-table";

// Per-column settings the DataTable reads, set through `meta` on a column:
//   helper.accessor("status", { header: "Status", meta: { filter: "select" } })
export type DataTableColumnMeta = {
  // Shows an inline filter under the header. Columns without it get an empty
  // cell in the filter row.
  filter?: "text" | "select";
  // Right-aligns the column, for numbers and amounts.
  align?: "start" | "end";
  // Header text in the CSV file, when the header is not plain text.
  exportLabel?: string;
  // Offers the column in the "Group by" list (when the table enables grouping).
  groupable?: boolean;
};

// TanStack Table v9 only has the APIs of features registered here: sorting,
// column filters, faceting (the distinct values for select filters), and
// row grouping with expandable group rows.
export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    datetime: sortFn_datetime,
    basic: sortFn_basic,
  },
  columnFacetingFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  columnGroupingFeature,
  groupedRowModel: createGroupedRowModel(),
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
  columnMeta: metaHelper<DataTableColumnMeta>(),
});

export type DataTableFeatures = typeof dataTableFeatures;

// Filter values written by the filter row: text filters store the typed
// string, select filters store { equals: value }.
export type SelectFilterValue = { equals: string };

type FilterableRow = { getValue: (columnId: string) => unknown };

function dataTableFilter(
  row: FilterableRow,
  columnId: string,
  filterValue: unknown,
): boolean {
  const value = row.getValue(columnId);
  if (
    typeof filterValue === "object" &&
    filterValue !== null &&
    "equals" in filterValue
  ) {
    return String(value) === String(filterValue.equals);
  }
  return String(value ?? "")
    .toLowerCase()
    .includes(String(filterValue).trim().toLowerCase());
}

// Spread into useTable so every column filters the way the filter row expects:
//   const table = useTable({ ...dataTableOptions, columns, data })
// Sorting always starts ascending (TanStack starts numbers descending).
// Grouped columns stay where they are, and open groups stay open when more
// rows arrive (infinite scroll).
export const dataTableOptions = {
  features: dataTableFeatures,
  defaultColumn: { filterFn: dataTableFilter, sortDescFirst: false },
  groupedColumnMode: false as const,
  autoResetExpanded: false,
};

// Column helper bound to the DataTable features, so `meta` is typed.
export function createDataTableColumns<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>();
}
