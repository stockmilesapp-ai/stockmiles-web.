import { useAuthStore } from "@/features/auth/auth.store";

const nextSteps = [
  {
    title: "Set up your business",
    description: "Name your business and choose what kind of goods you sell.",
  },
  {
    title: "Record a purchase trip",
    description: "Add the trip, its suppliers and bills, and what you spent on travel.",
  },
  {
    title: "Sell from stock",
    description: "Bill customers at the counter with stock kept up to date.",
  },
];

function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.name.split(" ")[0] || "there";

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-3xl font-bold tracking-tight text-fg">
        Welcome, {firstName}
      </h1>
      <p className="mt-2 text-fg-muted">
        You are signed in as {user?.email}. This is your StockMiles admin
        portal.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-fg">
          What you will be able to do here
        </h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {nextSteps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-lavender-500/10 text-sm font-semibold text-brand-lavender-600">
                {index + 1}
              </span>
              <h3 className="mt-4 font-display font-semibold text-fg">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {step.description}
              </p>
              <p className="mt-4 text-xs font-semibold tracking-wide text-fg-muted uppercase">
                Coming soon
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default DashboardPage;
