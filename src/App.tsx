import { useState } from "react";

type HealthStatus = "idle" | "checking" | "ok" | "error";

const statusText: Record<HealthStatus, string> = {
  idle: "Not checked yet",
  checking: "Checking…",
  ok: "API and database are reachable",
  error: "API or database is not reachable",
};

const statusColor: Record<HealthStatus, string> = {
  idle: "text-gray-500",
  checking: "text-gray-500",
  ok: "text-green-700",
  error: "text-red-700",
};

function App() {
  const [status, setStatus] = useState<HealthStatus>("idle");

  async function checkHealth() {
    setStatus("checking");
    try {
      const response = await fetch("/api/health");
      const body: { db?: string } = await response.json();
      setStatus(response.ok && body.db === "ok" ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">StockMiles</h1>
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={checkHealth}
          disabled={status === "checking"}
          className="rounded bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          Check API health
        </button>
        <p role="status" className={statusColor[status]}>
          {statusText[status]}
        </p>
      </div>
    </main>
  );
}

export default App;
