import GoogleSignInButton from "@/features/auth/components/GoogleSignInButton";
import Button from "@/shared/components/Button";
import Container from "@/shared/components/Container";

// A row of awning scallops along the bottom of the hero, alternating colours.
const scallops = Array.from({ length: 12 }, (_, index) => ({
  x: index * 100,
  fill: index % 2 === 0 ? "#2FBF71" : "#7B7FE0",
}));

function Hero() {
  return (
    <section className="relative isolate flex min-h-[90vh] items-center overflow-hidden bg-surface pt-24">
      <div
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-lavender-50 via-surface to-surface" />
        <div className="absolute -top-24 -left-24 size-96 rounded-full bg-brand-green-500/20 blur-3xl" />
        <div className="absolute top-10 -right-32 size-[28rem] rounded-full bg-brand-lavender-500/20 blur-3xl" />
        <svg
          className="absolute inset-x-0 bottom-0 w-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          {scallops.map((scallop) => (
            <path
              key={scallop.x}
              d={`M${scallop.x} 40 h100 v50 a50 30 0 0 1 -100 0 z`}
              fill={scallop.fill}
              opacity="0.12"
            />
          ))}
        </svg>
      </div>

      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <img
            src="/logo-mark.svg"
            alt="StockMiles"
            className="mx-auto mb-6 size-20 drop-shadow-[0_8px_24px_rgba(47,191,113,0.25)] sm:size-24"
          />
          <p className="mb-4 inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold tracking-wide text-fg-muted uppercase">
            Retail POS &amp; Inventory
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-fg sm:text-5xl md:text-6xl">
            Every <span className="text-brand-green-500">mile</span>. Every
            stock. Every <span className="text-brand-lavender-500">sale</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-fg-muted">
            StockMiles is built for store owners who travel to buy their stock.
            Record each purchase trip, see what every item really cost you once
            travel and transport are included, and follow it all the way to
            the sale.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-start">
            <GoogleSignInButton />
            <Button href="#features">See features</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
