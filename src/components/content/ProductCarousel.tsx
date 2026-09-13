"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import ProductCard, { ProductCardProps } from "./ProductCard";
import { cn } from "@/lib/utils";

interface ProductCarouselProduct extends ProductCardProps {
  id: string | number;
}

interface ProductCarouselItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ProductCarouselItem = React.forwardRef<
  HTMLDivElement,
  ProductCarouselItemProps
>(({ children, className, ...props }, ref) => (
  <CarouselItem
    ref={ref}
    className={cn(
      "basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4",
      className
    )}
    {...props}
  >
    {children}
  </CarouselItem>
));
ProductCarouselItem.displayName = "ProductCarouselItem";

interface ProductCarouselProps {
  products?: ProductCarouselProduct[];
  children?: React.ReactNode;
  className?: string;
}

const ProductCarousel = ({
  products,
  children,
  className,
}: ProductCarouselProps) => {
  return (
    <section className={cn("w-full mb-16 px-6", className)}>
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          {products?.map(({ id, ...product }) => (
            <ProductCarouselItem key={id}>
              <ProductCard {...product} />
            </ProductCarouselItem>
          ))}
          {children}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ProductCarousel;
export { ProductCarouselItem };
export type { ProductCarouselProduct };
