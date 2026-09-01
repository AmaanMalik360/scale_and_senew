import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  hoverImage: string;
  href: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Crocodile Black Wallet",
    category: "Wallets",
    price: "Rs 18,500",
    image: "/products/assets/Crocodile%20Leather%20Black%20Wallet.jpeg",
    hoverImage: "/products/new-assets/Black%20wallet%20sk%20(2).png",
    href: "/category/wallets",
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

const ProductCarousel = () => {
  return (
    <section className="w-full mb-16 px-6">
      <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="">
            {products.map((product) => (
               <CarouselItem
                 key={product.id}
                 className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
               >
                 <Link href={product.href}>
                  <Card className="border-none shadow-none bg-transparent group">
                    <CardContent className="p-0">
                      <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
                        />
                        <img
                          src={product.hoverImage}
                          alt={`${product.name} lifestyle`}
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-black/[0.03]"></div>
                        {(product.id === 1 || product.id === 3) && (
                          <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-black">
                            NEW
                          </div>
                        )}
                      </div>
                     <div className="space-y-1">
                       <p className="text-sm font-light text-foreground">
                         {product.category}
                       </p>
                       <div className="flex justify-between items-center">
                         <h3 className="text-sm font-medium text-foreground">
                           {product.name}
                         </h3>
                         <p className="text-sm font-light text-foreground">
                           {product.price}
                         </p>
                       </div>
                     </div>
                   </CardContent>
                 </Card>
                 </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
    </section>
  );
};

export default ProductCarousel;