import {
  useStatusStore,
  type HealthStatus,
} from "@/features/status/status.store";

const statusText: Record<HealthStatus, string> = {
  idle: "Not checked yet",
  checking: "Checking…",
  ok: "API and database are reachable",
  error: "API or database is not reachable",
};

const statusColor: Record<HealthStatus, string> = {
  idle: "text-fg-muted",
  checking: "text-fg-muted",
  ok: "text-green-700",
  error: "text-red-700",
};

function HealthCheck() {
  const health = useStatusStore((state) => state.health);
  const checkHealth = useStatusStore((state) => state.checkHealth);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={checkHealth}
        disabled={health === "checking"}
        className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border border-border bg-surface px-5 text-sm font-semibold text-fg transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-70"
      >
        Check API health
      </button>
      <p role="status" className={statusColor[health]}>
        {statusText[health]}
      </p>
    </div>
  );
}

export default HealthCheck;
