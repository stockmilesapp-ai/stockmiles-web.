import FeatureGrid from "@/features/home/components/FeatureGrid";
import GetStarted from "@/features/home/components/GetStarted";
import Hero from "@/features/home/components/Hero";
import WhyStockMiles from "@/features/home/components/WhyStockMiles";

function HomePage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <WhyStockMiles />
      <GetStarted />
    </>
  );
}

export default HomePage;
