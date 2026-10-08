import HealthCheck from "@/features/status/components/HealthCheck";
import Container from "@/shared/components/Container";

function StatusPage() {
  return (
    <Container className="pt-28 pb-20">
      <h1 className="font-display text-3xl font-bold tracking-tight text-fg">
        System status
      </h1>
      <p className="mt-2 text-fg-muted">
        Checks that the StockMiles API and its database are reachable.
      </p>
      <div className="mt-8">
        <HealthCheck />
      </div>
    </Container>
  );
}

export default StatusPage;
