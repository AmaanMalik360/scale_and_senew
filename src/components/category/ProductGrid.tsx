"use client";

import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import Pagination from "./Pagination";
import pantheonImage from "@/assets/pantheon.jpg";
import eclipseImage from "@/assets/eclipse.jpg";
import haloImage from "@/assets/halo.jpg";
import obliqueImage from "@/assets/oblique.jpg";
import lintelImage from "@/assets/lintel.jpg";
import shadowlineImage from "@/assets/shadowline.jpg";
import organicEarring from "@/assets/organic-earring.png";
import linkBracelet from "@/assets/link-bracelet.png";
import { StaticImageData } from "next/image";
import { ProductWithCategory, useGetProductsQuery } from "@/state/products-api";
import { getImageUrl } from "@/lib/utils";

// interface Product {
//   id: number;
//   name: string;
//   category: string;
//   price: string;
//   image: StaticImageData;
//   isNew?: boolean;
// }

// Extended product list for category page
// const products: Product[] = [
//   {
//     id: 1,
//     name: "Pantheon",
//     category: "Earrings",
//     price: "€2,850",
//     image: pantheonImage,
//     isNew: true,
//   },
//   {
//     id: 2,
//     name: "Eclipse",
//     category: "Bracelets",
//     price: "€3,200",
//     image: eclipseImage,
//   },
//   {
//     id: 3,
//     name: "Halo",
//     category: "Earrings",
//     price: "€1,950",
//     image: haloImage,
//     isNew: true,
//   },
//   {
//     id: 4,
//     name: "Oblique",
//     category: "Earrings",
//     price: "€1,650",
//     image: obliqueImage,
//   },
//   {
//     id: 5,
//     name: "Lintel",
//     category: "Earrings",
//     price: "€2,250",
//     image: lintelImage,
//   },
//   {
//     id: 6,
//     name: "Shadowline",
//     category: "Bracelets",
//     price: "€3,950",
//     image: shadowlineImage,
//   },
//   {
//     id: 7,
//     name: "Meridian",
//     category: "Earrings",
//     price: "€2,450",
//     image: pantheonImage,
//   },
//   {
//     id: 8,
//     name: "Vertex",
//     category: "Bracelets",
//     price: "€2,800",
//     image: eclipseImage,
//   },
//   {
//     id: 9,
//     name: "Apex",
//     category: "Earrings",
//     price: "€1,550",
//     image: haloImage,
//   },
//   {
//     id: 10,
//     name: "Zenith",
//     category: "Earrings",
//     price: "€1,850",
//     image: obliqueImage,
//   },
//   {
//     id: 11,
//     name: "Prism",
//     category: "Earrings",
//     price: "€2,050",
//     image: lintelImage,
//   },
//   {
//     id: 12,
//     name: "Radiant",
//     category: "Bracelets",
//     price: "€3,650",
//     image: shadowlineImage,
//   },
//   {
//     id: 13,
//     name: "Stellar",
//     category: "Earrings",
//     price: "€2,150",
//     image: pantheonImage,
//   },
//   {
//     id: 14,
//     name: "Cosmos",
//     category: "Bracelets",
//     price: "€2,950",
//     image: eclipseImage,
//   },
//   {
//     id: 15,
//     name: "Aurora",
//     category: "Earrings",
//     price: "€1,750",
//     image: haloImage,
//   },
//   {
//     id: 16,
//     name: "Nebula",
//     category: "Earrings",
//     price: "€1,850",
//     image: obliqueImage,
//   },
//   {
//     id: 17,
//     name: "Orbit",
//     category: "Earrings",
//     price: "€2,350",
//     image: lintelImage,
//   },
//   {
//     id: 18,
//     name: "Galaxy",
//     category: "Bracelets",
//     price: "€3,450",
//     image: shadowlineImage,
//   },
//   {
//     id: 19,
//     name: "Lunar",
//     category: "Earrings",
//     price: "€2,050",
//     image: pantheonImage,
//   },
//   {
//     id: 20,
//     name: "Solar",
//     category: "Bracelets",
//     price: "€3,150",
//     image: eclipseImage,
//   },
//   {
//     id: 21,
//     name: "Astral",
//     category: "Earrings",
//     price: "€1,650",
//     image: haloImage,
//   },
//   {
//     id: 22,
//     name: "Cosmic",
//     category: "Earrings",
//     price: "€1,950",
//     image: obliqueImage,
//   },
//   {
//     id: 23,
//     name: "Celestial",
//     category: "Earrings",
//     price: "€2,250",
//     image: lintelImage,
//   },
//   {
//     id: 24,
//     name: "Ethereal",
//     category: "Bracelets",
//     price: "€3,750",
//     image: shadowlineImage,
//   },
// ];

interface ProductGridProps {
  products: ProductWithCategory[];
  isLoading: boolean;
  error: unknown
}

// Helper function to format price from cents to euros
const formatPrice = (priceInCents: number): string => {
  return `€${(priceInCents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

const ProductGrid = ({ products, isLoading, error }: ProductGridProps) => {
  // const { data: products = [], isLoading, error } = useGetProductsQuery({ category_slug: category });

  if (isLoading) {
    return (
      <section className="w-full px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square mb-3 bg-muted/20 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted/20 rounded w-1/2"></div>
                <div className="h-4 bg-muted/20 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full px-6 mb-16 text-center">
        <p className="text-muted-foreground">Failed to load products. Please try again.</p>
      </section>
    );
  }

  return (
    <section className="w-full px-6 mb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product: ProductWithCategory) => {
          return (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card
                className="border-none shadow-none bg-transparent group cursor-pointer"
              >
                <CardContent className="p-0">
                  <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                    {/* Use first product image if available, otherwise use placeholder */}
                    <img
                      src={getImageUrl(product?.images?.[0])}
                      alt={product?.title}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
                    />
                    {product?.images?.length > 1 ? (<img
                      src={getImageUrl(product?.images?.[1])}
                      alt={`${product?.title} lifestyle`}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
                    />) : (<img
                      src={getImageUrl(product?.images?.[0])}
                      alt={product?.title}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
                    />)}
                    <div className="absolute inset-0 bg-black/[0.03]"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-light text-foreground">
                      {product?.category?.name}
                    </p>
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-foreground">
                        {product?.title}
                      </h3>
                      <p className="text-sm font-light text-foreground">
                        {formatPrice(product?.price)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Pagination />
    </section>
  );
};

export default ProductGrid;