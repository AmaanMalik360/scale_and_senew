"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import CategoryHeader from "../../../../components/category/CategoryHeader";
import FilterSortBar from "../../../../components/category/FilterSortBar";
import ProductGrid from "../../../../components/category/ProductGrid";
import { useGetProductsQuery } from "@/state/products-api";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const { data: products = [], isLoading, error } = useGetProductsQuery({ category_slug: category });

  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <main className="pt-6">
      <CategoryHeader 
        category={category || 'All Products'} 
      />
      
      <FilterSortBar 
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        itemCount={products.length}
      />
      <ProductGrid products={products} isLoading={isLoading} error={error} />
    </main>
  );
}
