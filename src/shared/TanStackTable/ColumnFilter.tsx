import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Column, RowData } from "@tanstack/react-table";
import Select from "@/shared/components/Select";
import type {
  DataTableFeatures,
  SelectFilterValue,
} from "@/shared/TanStackTable/features";

const ALL = "__all__";

type ColumnFilterProps<TData extends RowData> = {
  column: Column<DataTableFeatures, TData, unknown>;
};

// The filter cell under one header, by the column's meta.filter.
function ColumnFilter<TData extends RowData>({
  column,
}: ColumnFilterProps<TData>) {
  const kind = column.columnDef.meta?.filter;
  if (kind === "text") return <TextFilter column={column} />;
  if (kind === "select") return <SelectFilter column={column} />;
  return null;
}

function TextFilter<TData extends RowData>({
  column,
}: ColumnFilterProps<TData>) {
  const current = column.getFilterValue();
  const [text, setText] = useState(typeof current === "string" ? current : "");

  // Filter a moment after typing stops, not on every key press.
  useEffect(() => {
    const timer = setTimeout(
      () => column.setFilterValue(text.trim() === "" ? undefined : text),
      200,
    );
    return () => clearTimeout(timer);
  }, [column, text]);

  return (
    <label className="flex min-h-9 items-center gap-2 rounded-lg border border-border bg-surface px-2.5 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
      <Search aria-hidden="true" className="size-3.5 shrink-0 text-fg-muted" />
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Filter…"
        aria-label={`Filter ${column.id}`}
        className="w-full min-w-0 bg-transparent text-sm font-normal text-fg outline-none placeholder:text-fg-muted"
      />
    </label>
  );
}

function SelectFilter<TData extends RowData>({
  column,
}: ColumnFilterProps<TData>) {
  const unique = column.getFacetedUniqueValues();
  const options = useMemo(
    () => [
      { value: ALL, label: "All" },
      ...[...unique.keys()]
        .filter((value) => value !== null && value !== undefined && value !== "")
        .map((value) => String(value))
        .sort((a, b) => a.localeCompare(b))
        .map((value) => ({ value, label: value })),
    ],
    [unique],
  );
  const current = column.getFilterValue() as SelectFilterValue | undefined;

  return (
    <Select
      options={options}
      value={current?.equals ?? ALL}
      onChange={(value) =>
        column.setFilterValue(
          value === null || value === ALL ? undefined : { equals: value },
        )
      }
      searchable={options.length > 8}
      aria-label={`Filter ${column.id}`}
    />
  );
}

export default ColumnFilter;
