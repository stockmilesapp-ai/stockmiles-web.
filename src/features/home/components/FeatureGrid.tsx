import {
  Calculator,
  Package,
  Receipt,
  Ruler,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import Container from "@/shared/components/Container";
import SectionHeading from "@/shared/components/SectionHeading";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Truck,
    title: "Purchase trips",
    description:
      "Keep every trip, supplier and bill together, with the expenses that came with it.",
  },
  {
    icon: Calculator,
    title: "Landed cost",
    description:
      "Know the real cost of each item after travel and transport, not just the bill price.",
  },
  {
    icon: Package,
    title: "Stock you can trust",
    description:
      "Every purchase, sale, return and damage is recorded, so stock always adds up.",
  },
  {
    icon: Receipt,
    title: "Billing at the counter",
    description:
      "Bill customers quickly and take payments, with stock updated as you sell.",
  },
  {
    icon: Users,
    title: "Your team, your rules",
    description:
      "Give owners, managers and cashiers access to only what they need.",
  },
  {
    icon: Ruler,
    title: "Fits what you sell",
    description:
      "Describe your products your way and sell by piece, length, weight or set.",
  },
];

function FeatureGrid() {
  return (
    <section id="features" className="scroll-mt-16 py-20 sm:py-28">
      <Container>
        <SectionHeading
          title="Everything between buying and selling"
          description="One record follows your stock from the day you buy it to the day you sell it."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-brand-green-500/40"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand-green-500/10 text-brand-green-600">
                <feature.icon aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-fg">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default FeatureGrid;
