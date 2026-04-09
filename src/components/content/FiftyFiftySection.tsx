import WalletImage from "@/assets/scale_senew/Crocodile Scale Leather Brown Wallet.jpeg";
import LadiesBag from "@/assets/scale_senew/Snake Leather White Ladies Bag.jpeg";
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
                src={WalletImage.src} 
                alt="Crocodile Scale Wallet" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Crocodile Scale Wallet
            </h3>
            <p className="text-sm font-light text-foreground">
              Premium crocodile scale leather wallet with elegant design
            </p>
          </div>
        </div>

        <div>
          <Link href="/category/bags" className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <img 
                src={LadiesBag.src} 
                alt="Snake Leather White Ladies Bag" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Ladies Bag
            </h3>
            <p className="text-sm font-light text-foreground">
              Elegant and sophisticated designs for every occasion
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiftyFiftySection;