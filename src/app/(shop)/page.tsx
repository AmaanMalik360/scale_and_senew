import LargeHero from "../../components/content/LargeHero";
import FiftyFiftySection from "../../components/content/FiftyFiftySection";
import OneThirdTwoThirdsSection from "../../components/content/OneThirdTwoThirdsSection";
import ProductCarousel, { ProductCarouselProduct } from "../../components/content/ProductCarousel";
import EditorialSection from "../../components/content/EditorialSection";

const featuredProducts: ProductCarouselProduct[] = [
  {
    id: 1,
    name: "Crocodile Wallet",
    category: "Wallets",
    price: "Rs 18,500",
    image: "/products/assets/Crocodile Leather Black Wallet.png",
    hoverImage: "/products/assets/Crocodile Scale Leather Brown Wallet.png",
    href: "/category/wallets",
    isNew: true,
  },
  {
    id: 2,
    name: "Snake Long Wallet",
    category: "Long Wallets",
    price: "Rs 22,000",
    image: "/products/assets/Purple Snake Leather Wallet (1).png",
    hoverImage: "/products/assets/Purple Snake Leather Wallet (2).png",
    href: "/category/wallets",
  },
  {
    id: 3,
    name: "Card Holder",
    category: "Card Holders",
    price: "Rs 9,500",
    image: "/products/assets/Emerald Mosaic Card Holder.png",
    hoverImage: "/products/assets/Gold Card Holder (1).png",
    href: "/category/card-holders",
    isNew: true,
  },
  {
    id: 4,
    name: "Red Snake Slim Wallet",
    category: "Wallets",
    price: "Rs 16,500",
    image: "/products/assets/Red%20Snake%20Wallet%20Small%20(1).png",
    hoverImage: "/products/assets/Red%20Snake%20Wallet%20Small%20(4).png",
    href: "/category/wallets",
  },
  {
    id: 5,
    name: "White Snake Ladies Bag",
    category: "Bags",
    price: "Rs 29,000",
    image: "/products/assets/Snake%20Leather%20White%20Ladies%20Bag.jpeg",
    hoverImage: "/products/assets/Snake%20Leather%20Ladies%20Bag%20(4).png",
    href: "/category/bags",
  },
  {
    id: 6,
    name: "Red Crocodile Hand Bag",
    category: "Bags",
    price: "Rs 34,000",
    image: "/products/assets/Red%20HandBag%20Crocodile%20%20(1).png",
    hoverImage: "/products/assets/Red%20HandBag%20Crocodile%20%20(3).png",
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
