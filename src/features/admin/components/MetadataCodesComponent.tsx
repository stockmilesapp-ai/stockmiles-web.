import { useMemo } from "react";
import { useTable } from "@tanstack/react-table";
import DataTable from "@/shared/TanStackTable/DataTable";
import {
  createDataTableColumns,
  dataTableOptions,
} from "@/shared/TanStackTable/features";
import { useAdminStore, type Code } from "../admin.store";

// One table row per code value, carrying its code, so the grid can group the
// values under their code.
type CodeValueRow = {
  id: string;
  codeKey: string;
  codeName: string;
  key: string;
  label: string;
  description: string | null;
  sortOrder: number;
  status: "Active" | "Inactive";
  scope: "Shared" | "Business";
};

function toRows(codes: Code[]): CodeValueRow[] {
  return codes.flatMap((code) =>
    code.codeValues.map((value) => ({
      id: value.id,
      codeKey: code.key,
      codeName: code.name,
      key: value.key,
      label: value.label,
      description: value.description,
      sortOrder: value.sortOrder,
      status: value.isActive ? "Active" : "Inactive",
      scope: value.tenantId === null ? "Shared" : "Business",
    })),
  );
}

const helper = createDataTableColumns<CodeValueRow>();

const columns = helper.columns([
  helper.accessor("codeName", {
    header: "Code",
    meta: { filter: "select", groupable: true },
    cell: (info) => (
      <span className="inline-flex items-baseline gap-2">
        {info.getValue()}
        <span className="font-mono text-xs font-normal text-fg-muted">
          {info.row.original.codeKey}
        </span>
      </span>
    ),
  }),
  helper.accessor("key", {
    header: "Key",
    meta: { filter: "text" },
    cell: (info) => <span className="font-mono text-xs">{info.getValue()}</span>,
  }),
  helper.accessor("label", { header: "Label", meta: { filter: "text" } }),
  helper.accessor("description", {
    header: "Description",
    cell: (info) => info.getValue() ?? <span className="text-fg-muted">—</span>,
  }),
  helper.accessor("sortOrder", { header: "Order", meta: { align: "end" } }),
  helper.accessor("status", {
    header: "Status",
    meta: { filter: "select", groupable: true },
    cell: (info) =>
      info.getValue() === "Active" ? (
        <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success-strong">
          Active
        </span>
      ) : (
        <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-semibold text-warning-strong">
          Inactive
        </span>
      ),
  }),
  helper.accessor("scope", {
    header: "Scope",
    meta: { filter: "select", groupable: true },
  }),
]);

export default function MetadataCodesComponent() {
  const codes = useAdminStore((state) => state.metadata.codes);
  const status = useAdminStore((state) => state.metadata.status);
  const data = useMemo(() => toRows(codes), [codes]);

  const table = useTable({
    ...dataTableOptions,
    columns,
    data,
    getRowId: (row) => row.id,
    initialState: { grouping: ["codeName"] },
  });

  return (
    <DataTable
      table={table}
      enableGrouping
      exportCsv
      csvFileName="codes"
      isLoading={status === "idle" || status === "loading"}
      emptyMessage={
        status === "error" ? "Codes could not be loaded." : "No codes yet."
      }
    />
  );
}
