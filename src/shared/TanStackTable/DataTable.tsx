import { useEffect, useRef, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Download,
} from "lucide-react";
import type { ReactTable, RowData } from "@tanstack/react-table";
import Button from "@/shared/components/Button";
import Select from "@/shared/components/Select";
import ColumnFilter from "@/shared/TanStackTable/ColumnFilter";
import { exportTableToCsv } from "@/shared/TanStackTable/exportCsv";
import type { DataTableFeatures } from "@/shared/TanStackTable/features";

// Renders a TanStack Table v9 instance as the admin data grid. The caller owns
// the table; this component owns markup, styling and interactions.
//
//   const helper = createDataTableColumns<Code>();
//   const columns = helper.columns([
//     helper.accessor("key", { header: "Key", meta: { filter: "text" } }),
//     helper.accessor("label", { header: "Label" }),
//   ]);
//   const table = useTable({ ...dataTableOptions, columns, data });
//   <DataTable table={table} exportCsv csvFileName="codes" />
//
// Grouping (one level, like ag-grid row grouping): mark columns with
// meta: { groupable: true } and pass enableGrouping. A "Group by" list appears
// above the table; to start grouped, add initialState: { grouping: ["city"] }
// to useTable.
//
// Keep `columns` and `data` stable (module scope, state or useMemo): a new
// array on every render makes the table recompute its rows each time.

export type DataTableProps<TData extends RowData> = {
  table: ReactTable<DataTableFeatures, TData>;

  // Loads the next page when the user scrolls near the end of the list.
  infiniteScroll?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  // Height of the scrolling area; the header stays in place inside it.
  maxHeight?: string;

  // Adds an "Export CSV" button for the rows currently shown.
  exportCsv?: boolean;
  csvFileName?: string;

  // Adds a "Group by" list of the columns marked meta.groupable.
  enableGrouping?: boolean;

  // First load: shows placeholder rows instead of the empty message.
  isLoading?: boolean;
  emptyMessage?: ReactNode;
  className?: string;
};

const SKELETON_ROWS = 5;
const NO_GROUPING = "__none__";

function columnLabel(header: unknown, id: string) {
  return typeof header === "string" && header !== "" ? header : id;
}

function DataTable<TData extends RowData>({
  table,
  infiniteScroll = false,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  maxHeight = "32rem",
  exportCsv = false,
  csvFileName = "export",
  enableGrouping = false,
  isLoading = false,
  emptyMessage = "No records",
  className,
}: DataTableProps<TData>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const headerGroups = table.getHeaderGroups();
  const leafColumns = table.getAllLeafColumns();
  const rows = table.getRowModel().rows;
  const hasFilters = leafColumns.some((column) => column.columnDef.meta?.filter);

  const groupableColumns = leafColumns.filter(
    (column) => column.columnDef.meta?.groupable && column.getCanGroup(),
  );
  const groupedBy = table.state.grouping[0] ?? null;
  const groupOptions = [
    { value: NO_GROUPING, label: "No grouping" },
    ...groupableColumns.map((column) => ({
      value: column.id,
      label: columnLabel(column.columnDef.header, column.id),
    })),
  ];
  const recordCount = table.getFilteredRowModel().rows.length;
  const groupCount = groupedBy ? table.getGroupedRowModel().rows.length : 0;
  const showToolbar = exportCsv || (enableGrouping && groupableColumns.length > 0);

  // Ask for the next page when the end of the list scrolls into view.
  useEffect(() => {
    if (!infiniteScroll || !hasMore || isLoadingMore || !onLoadMore) return;
    const end = endRef.current;
    if (!end) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadMore();
      },
      { root: scrollRef.current, rootMargin: "0px 0px 160px 0px" },
    );
    observer.observe(end);
    return () => observer.disconnect();
  }, [infiniteScroll, hasMore, isLoadingMore, onLoadMore, rows.length]);

  return (
    <div
      className={[
        "flex flex-col overflow-hidden rounded-xl border border-border bg-surface",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-2">
          {enableGrouping && groupableColumns.length > 0 && (
            <>
              <span className="text-sm text-fg-muted">Group by</span>
              <div className="w-48">
                <Select
                  options={groupOptions}
                  value={groupedBy ?? NO_GROUPING}
                  onChange={(value) =>
                    table.setGrouping(
                      value === null || value === NO_GROUPING ? [] : [value],
                    )
                  }
                  aria-label="Group by"
                />
              </div>
              {groupedBy && (
                <Button
                  variant="ghost"
                  onClick={() =>
                    table.toggleAllRowsExpanded(!table.getIsAllRowsExpanded())
                  }
                  className="min-h-9 px-3"
                >
                  {table.getIsAllRowsExpanded() ? (
                    <ChevronsDownUp aria-hidden="true" className="size-4" />
                  ) : (
                    <ChevronsUpDown aria-hidden="true" className="size-4" />
                  )}
                  {table.getIsAllRowsExpanded() ? "Collapse all" : "Expand all"}
                </Button>
              )}
            </>
          )}
          <span className="text-sm text-fg-muted">
            {recordCount} {recordCount === 1 ? "row" : "rows"}
            {groupedBy &&
              ` in ${groupCount} ${groupCount === 1 ? "group" : "groups"}`}
          </span>
          <span className="flex-1" />
          {exportCsv && (
            <Button
              onClick={() => exportTableToCsv(table, csvFileName)}
              disabled={recordCount === 0}
              className="min-h-9 px-4"
            >
              <Download aria-hidden="true" className="size-4" />
              Export CSV
            </Button>
          )}
        </div>
      )}

      <div
        ref={scrollRef}
        className="overflow-auto"
        style={infiniteScroll ? { maxHeight } : undefined}
      >
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            {headerGroups.map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const column = header.column;
                  const canSort = !header.isPlaceholder && column.getCanSort();
                  const sorted = column.getIsSorted();
                  const alignEnd = column.columnDef.meta?.align === "end";
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      scope="col"
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : undefined
                      }
                      className={[
                        "sticky top-0 z-10 border-b border-border bg-surface-2 px-4 py-2.5 text-xs font-semibold tracking-wide text-fg-muted uppercase",
                        alignEnd ? "text-right" : "text-left",
                      ].join(" ")}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={column.getToggleSortingHandler()}
                          className={[
                            "inline-flex cursor-pointer items-center gap-1 align-middle uppercase transition-colors hover:text-fg",
                            sorted ? "text-fg" : "",
                            alignEnd ? "flex-row-reverse" : "",
                          ].join(" ")}
                        >
                          <table.FlexRender header={header} />
                          {sorted === "asc" ? (
                            <ArrowUp aria-hidden="true" className="size-3.5" />
                          ) : sorted === "desc" ? (
                            <ArrowDown aria-hidden="true" className="size-3.5" />
                          ) : (
                            <ChevronsUpDown
                              aria-hidden="true"
                              className="size-3.5 opacity-50"
                            />
                          )}
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
            {hasFilters && (
              <tr>
                {leafColumns.map((column) => (
                  <th
                    key={column.id}
                    scope="col"
                    className="sticky top-10 z-10 border-b border-border bg-surface px-4 py-2 text-left font-normal"
                  >
                    <ColumnFilter column={column} />
                  </th>
                ))}
              </tr>
            )}
          </thead>

          <tbody>
            {isLoading &&
              Array.from({ length: SKELETON_ROWS }, (_, index) => (
                <tr key={`skeleton-${index}`}>
                  {leafColumns.map((column) => (
                    <td key={column.id} className="border-b border-border px-4 py-3">
                      <span className="block h-4 w-3/4 animate-pulse rounded bg-surface-2" />
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={leafColumns.length}
                  className="px-4 py-10 text-center text-fg-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!isLoading &&
              rows.map((row) => {
                if (row.getIsGrouped()) {
                  const groupCell = row
                    .getAllCells()
                    .find((cell) => cell.getIsGrouped());
                  const expanded = row.getIsExpanded();
                  return (
                    <tr key={row.id} className="bg-surface-2/40">
                      <td
                        colSpan={leafColumns.length}
                        className="border-b border-border px-2 py-1.5"
                      >
                        <button
                          type="button"
                          onClick={row.getToggleExpandedHandler()}
                          aria-expanded={expanded}
                          className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-left transition-colors hover:bg-surface-2"
                        >
                          <ChevronRight
                            aria-hidden="true"
                            className={[
                              "size-4 shrink-0 text-fg-muted transition-transform",
                              expanded ? "rotate-90" : "",
                            ].join(" ")}
                          />
                          <span className="text-xs font-semibold tracking-wide text-fg-muted uppercase">
                            {groupCell
                              ? columnLabel(
                                  groupCell.column.columnDef.header,
                                  groupCell.column.id,
                                )
                              : ""}
                          </span>
                          <span className="font-semibold text-fg">
                            {groupCell && <table.FlexRender cell={groupCell} />}
                          </span>
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary-strong">
                            {row.subRows.length}
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                }
                return (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-surface-2/60"
                  >
                    {row.getAllCells().map((cell, index) => (
                      <td
                        key={cell.id}
                        className={[
                          "border-b border-border py-3 pr-4 text-fg",
                          row.depth > 0 && index === 0 ? "pl-10" : "pl-4",
                          cell.column.columnDef.meta?.align === "end"
                            ? "text-right tabular-nums"
                            : "text-left",
                        ].join(" ")}
                      >
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                );
              })}
          </tbody>
        </table>

        {infiniteScroll && !isLoading && (
          <div ref={endRef} className="px-4 py-3 text-center text-sm text-fg-muted">
            {isLoadingMore ? "Loading more…" : hasMore ? "" : rows.length > 0 ? "End of list" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

export default DataTable;
