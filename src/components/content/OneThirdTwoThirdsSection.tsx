import Link from "next/link";

const OneThirdTwoThirdsSection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Link href="/category/wallets" className="block">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <img 
                src="/products/new-assets/Black%20wallet%20sk%20(1).png" 
                alt="Black exotic leather wallet" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Wallet Essentials
            </h3>
            <p className="text-sm font-light text-foreground">
              Everyday carry pieces designed for structure and durability.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <Link href="/category/bags" className="block">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <img 
                src="/products/new-assets/Snake%20Leather%20Ladies%20Bag%20(2).png" 
                alt="Snake leather ladies bag" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">
              Signature Bag Collection
            </h3>
            <p className="text-sm font-light text-foreground">
              Refined silhouettes for daily wear and standout occasions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OneThirdTwoThirdsSection;