import LargeHero from "../../components/content/LargeHero";
import FiftyFiftySection from "../../components/content/FiftyFiftySection";
import OneThirdTwoThirdsSection from "../../components/content/OneThirdTwoThirdsSection";
import ProductCarousel, { ProductCarouselProduct } from "../../components/content/ProductCarousel";
import EditorialSection from "../../components/content/EditorialSection";

const featuredProducts: ProductCarouselProduct[] = [
  {
    id: 1,
    name: "Crocodile Black Wallet",
    category: "Wallets",
    price: "Rs 18,500",
    image: "/products/assets/Crocodile%20Leather%20Black%20Wallet.jpeg",
    hoverImage: "/products/new-assets/Black%20wallet%20sk%20(2).png",
    href: "/category/wallets",
    isNew: true,
  },
  {
    id: 2,
    name: "Snake Long Wallet",
    category: "Long Wallets",
    price: "Rs 22,000",
    image: "/products/assets/Snake%20Leather%20Black%20Long%20Wallet.jpeg",
    hoverImage: "/products/new-assets/Long%20snake%20skin%20%20(2).png",
    href: "/category/wallets",
  },
  {
    id: 3,
    name: "Emerald Card Holder",
    category: "Card Holders",
    price: "Rs 9,500",
    image: "/products/assets/Emerald%20Mosaic%20Card%20Holder.jpeg",
    hoverImage: "/products/new-assets/wallet%201%20(1).png",
    href: "/category/card-holders",
    isNew: true,
  },
  {
    id: 4,
    name: "White Snake Ladies Bag",
    category: "Bags",
    price: "Rs 29,000",
    image: "/products/assets/Snake%20Leather%20White%20Ladies%20Bag.jpeg",
    hoverImage: "/products/new-assets/Snake%20Leather%20Ladies%20Bag%20(4).png",
    href: "/category/bags",
  },
  {
    id: 5,
    name: "Red Snake Small Wallet",
    category: "Wallets",
    price: "Rs 16,500",
    image: "/products/new-assets/Red%20Snake%20Wallet%20Small%20(1).png",
    hoverImage: "/products/new-assets/Red%20Snake%20Wallet%20Small%20(4).png",
    href: "/category/wallets",
  },
  {
    id: 6,
    name: "Red Crocodile Hand Bag",
    category: "Bags",
    price: "Rs 34,000",
    image: "/products/new-assets/Red%20HandBag%20Crocodile%20%20(1).png",
    hoverImage: "/products/new-assets/Red%20HandBag%20Crocodile%20%20(3).png",
    href: "/category/bags",
  },
];

export default function Home() {
  return (
    <main className="pt-6">
      <FiftyFiftySection />
      <ProductCarousel products={featuredProducts} />
      <LargeHero />
      <OneThirdTwoThirdsSection />
      <EditorialSection />
    </main>
  );
}
