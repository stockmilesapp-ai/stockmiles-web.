import { Route, ShieldCheck, Store, type LucideIcon } from "lucide-react";
import Container from "@/shared/components/Container";
import SectionHeading from "@/shared/components/SectionHeading";

type Reason = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const reasons: Reason[] = [
  {
    icon: Route,
    title: "Built around the purchase trip",
    description:
      "StockMiles starts where your stock does, on the road, so your costs are right before the first sale.",
  },
  {
    icon: Store,
    title: "Made for whatever you sell",
    description:
      "Clothing, mobile accessories, furniture, footwear and more. If you travel to buy stock and sell it from your store, it fits.",
  },
  {
    icon: ShieldCheck,
    title: "Your data stays yours",
    description:
      "Each business's records are kept separate. Nothing is shared between stores.",
  },
];

function WhyStockMiles() {
  return (
    <section id="why-us" className="scroll-mt-16 bg-surface py-20 sm:py-28">
      <Container>
        <SectionHeading title="Why store owners choose StockMiles" />
        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {reasons.map((reason) => (
            <div key={reason.title} className="text-center sm:text-left">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-lavender-500/10 text-brand-lavender-600 sm:mx-0">
                <reason.icon aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-fg">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default WhyStockMiles;
