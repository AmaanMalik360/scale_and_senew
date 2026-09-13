"use client";

import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  href?: string;
  image: string;
  hoverImage?: string;
  name: string;
  category?: string;
  price?: string;
  isNew?: boolean;
  className?: string;
}

const ProductCard = ({
  href,
  image,
  hoverImage,
  name,
  category,
  price,
  isNew,
  className,
}: ProductCardProps) => {
  const card = (
    <Card
      className={cn(
        "border-none shadow-none bg-transparent group",
        className
      )}
    >
      <CardContent className="p-0">
        <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
          />
          {hoverImage && (
            <img
              src={hoverImage}
              alt={`${name} lifestyle`}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
            />
          )}
          <div className="absolute inset-0 bg-black/[0.03]" />
          {isNew && (
            <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium text-black">
              NEW
            </div>
          )}
        </div>
        <div className="space-y-1">
          {category && (
            <p className="text-sm font-light text-foreground">{category}</p>
          )}
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-foreground">{name}</h3>
            {price && (
              <p className="text-sm font-light text-foreground">{price}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block" aria-label={`View ${name}`}>
        {card}
      </Link>
    );
  }

  return card;
};

export default ProductCard;
export type { ProductCardProps };
