// import earringsCollection from "@/assets/earrings-collection.png";
// import linkBracelet from "@/assets/link-bracelet.png";
import Link from "next/link";
// import { StaticImageData } from "next/image";

const FiftyFiftySection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Link href="/category/wallets" className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <img 
                src="/products/assets/Crocodile%20leather%20Brown%20Wallet.jpeg" 
                alt="Crocodile Scale Wallet" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Crocodile Leather Wallet
            </h3>
            <p className="text-sm font-light text-foreground">
              Signature leather finish designed for everyday carry.
            </p>
          </div>
        </div>

        <div>
          <Link href="/category/bags" className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <img 
                src="/products/assets/Snake%20Leather%20White%20Ladies%20Bag.jpeg" 
                alt="Snake Leather White Ladies Bag" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Snake Leather Bag
            </h3>
            <p className="text-sm font-light text-foreground">
              Structured silhouette with premium exotic leather texture.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiftyFiftySection;