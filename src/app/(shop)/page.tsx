import LargeHero from "../../components/content/LargeHero";
import FiftyFiftySection from "../../components/content/FiftyFiftySection";
import OneThirdTwoThirdsSection from "../../components/content/OneThirdTwoThirdsSection";
import ProductCarousel from "../../components/content/ProductCarousel";
import EditorialSection from "../../components/content/EditorialSection";

export default function Home() {
  return (
    <main className="pt-6">
      <FiftyFiftySection />
      <ProductCarousel />
      <LargeHero />
      <OneThirdTwoThirdsSection />
      <EditorialSection />
    </main>
  );
}
