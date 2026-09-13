"use client";

import ProductCard from "../content/ProductCard";
import Pagination, { PaginationProps } from "./Pagination";
import { ProductWithCategory } from "@/state/products-api";
import { getImageUrl } from "@/lib/utils";
import { formatPrice } from "@/lib/currency";

interface ProductGridProps {
  products: ProductWithCategory[];
  isLoading: boolean;
  error: unknown;
  pagination: PaginationProps;
}

const ProductGrid = ({ products, isLoading, error, pagination }: ProductGridProps) => {

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
        {products.map((product: ProductWithCategory) => (
          <ProductCard
            key={product.id}
            href={`/product/${product.id}`}
            image={getImageUrl(product.images[0] ?? "")}
            hoverImage={getImageUrl(product.images[1] ?? product.images[0] ?? "")}
            name={product.title}
            category={product.category?.name}
            price={formatPrice(product.price_amount)}
            className="cursor-pointer"
          />
        ))}
      </div>

      <Pagination {...pagination} />
    </section>
  );
};

export default ProductGrid;