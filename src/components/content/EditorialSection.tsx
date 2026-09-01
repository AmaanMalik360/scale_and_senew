import { ArrowRight } from "lucide-react";
import Link from "next/link";

const EditorialSection = () => {
  return <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 max-w-[630px]">
          <h2 className="text-2xl font-normal text-foreground leading-tight md:text-xl">
            Crafted for Daily Carry, Built to Stand Out
          </h2>
          <p className="text-sm font-light text-foreground leading-relaxed">Scale &amp; Senew is shaped by a love for refined utility. We design wallets, bags, and card holders that balance statement textures with practical organization, so each piece works as hard as it looks.

        </p>
          <Link href="/about/our-story" className="inline-flex items-center gap-1 text-sm font-light text-foreground hover:text-foreground/80 transition-colors duration-200">
            <span>Read our full story</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        
        <div className="order-first md:order-last">
          <div className="w-full aspect-square overflow-hidden">
            <img src="/products/new-assets/Red%20Snake%20Wallet%20Small%20(2).png" alt="Scale and Senew red snake wallet" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>;
};
export default EditorialSection;