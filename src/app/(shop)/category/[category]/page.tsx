"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import CategoryHeader from "../../../../components/category/CategoryHeader";
import FilterSortBar from "../../../../components/category/FilterSortBar";
import ProductGrid from "../../../../components/category/ProductGrid";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  console.log(category)
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <main className="pt-6">
      <CategoryHeader 
        category={category || 'All Products'} 
      />
      
      <FilterSortBar 
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        itemCount={24}
      />
      
      <ProductGrid category={category} />
    </main>
  );
}
