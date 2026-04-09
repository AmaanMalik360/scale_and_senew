"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import CategoryHeader from "../../../../components/category/CategoryHeader";
import FilterSortBar from "../../../../components/category/FilterSortBar";
import ProductGrid from "../../../../components/category/ProductGrid";
import { useGetProductsQuery, PaginatedProductsResponse } from "@/state/products-api";
import { useAppSelector } from "@/app/redux";
import { Category } from "@/state/categories-api";
import { FilterConfig, FilterStateItem } from "@/types/filters";
import {
  useFlatCategories,
  useSelectedSubcategoryIds,
  useCategoryPath,
  useChildCategories
} from "./hooks";

const PRICE_OPTIONS = [
  { 
    label: "Under €10", 
    // value: "0-100000", 
    values: { min: 0, max: 1000 } 
  },
  { 
    label: "€10 – €20", 
    // value: "100000-200000", 
    values: { min: 1000, max: 2000 } 
  },
  { 
    label: "€20 – €30", 
    // value: "200000-300000", 
    values: { min: 2000, max: 3000 } 
  },
  { 
    label: "Over €30", 
    // value: "300000-", 
    values: { min: 3000 } 
  },
];


export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const slugArray = (params.slug as string[]) ?? [];
  const currentSlug = slugArray[slugArray.length - 1];
  
  // applied filters
  const selectedSubcategorySlugs = searchParams.getAll("subcategories");
  const sortBy = searchParams.get("sort_by") ?? "featured";

  const categories = useAppSelector((state) =>
    state.api.queries?.['getCategories({"slug":"fashion"})']?.data as Category[]
  );

  // Flat list for any slug/id lookup — categories from Redux is nested
  const flatCategories = useFlatCategories(categories);
  const currentCategory = flatCategories.find(c => c.slug === currentSlug);
  
  // Find root category for filterable attributes
  const rootCategory = flatCategories.find(c => c.slug === slugArray[0]);
  const selectedSubcategoryIds = useSelectedSubcategoryIds(flatCategories, selectedSubcategorySlugs);

  // Collect attribute value IDs from URL params
  const reservedKeys = new Set(["subcategories", "price", "sort_by"]);
  const attributeValueIds = useMemo(() => {
    const ids: number[] = [];
    (rootCategory?.filterable_attributes ?? []).forEach(attr => {
      const values = searchParams.getAll(attr.name);
      values.forEach(v => {
        const numValue = Number(v);
        if (!isNaN(numValue)) ids.push(numValue);
      });
    });
    return ids;
  }, [searchParams, rootCategory]);

  const { data: productsResponse, isLoading, error } = useGetProductsQuery({
    ...(selectedSubcategoryIds?.length
      ? { category_ids: selectedSubcategoryIds }
      : { category_slug: currentSlug }
    ),
    sort_by: sortBy,
    ...(searchParams.get('min_price') && { min_price: Number(searchParams.get('min_price')) }),
    ...(searchParams.get('max_price') && { max_price: Number(searchParams.get('max_price')) }),
    ...(attributeValueIds.length && { attribute_value_ids: attributeValueIds }),
  });

  const products = productsResponse?.data || [];

  const categoryPath = useCategoryPath(flatCategories, currentCategory); // categories/wallets/bi-fold
  const childCategories = useChildCategories(currentCategory); // return child categories (bi-fold, slim-wallets, etc.) if current category is wallets

  const filterConfig: FilterConfig[] = useMemo(() => {
    const configs: FilterConfig[] = [];
    
    if (childCategories.length > 0) {
      configs.push({
        type: "checkbox",
        key: "subcategories",
        label: "Category",
        options: childCategories.map(c => ({ label: c.name, value: c.slug })),
      });
    }
    
    configs.push({
      type: "radios_with_range",
      key: "price",
      label: "Price",
      options: PRICE_OPTIONS,
      allowCustom: true,
    });
    
    // Dynamic attribute filters from API
    (rootCategory?.filterable_attributes ?? []).forEach(attr => {
      configs.push({
        type: "checkbox",
        key: attr.name,
        label: attr.name.charAt(0).toUpperCase() + attr.name.slice(1),
        options: attr.values.map(v => ({
          label: v.value,
          value: String(v.id),
        })),
      });
    });
    
    return configs;
  }, [childCategories, rootCategory]);

  const activeFilters = useMemo(() => {
    const result: FilterStateItem[] = [];
    filterConfig.forEach(f => {
      if (f.type === "checkbox") {
        const values = searchParams.getAll(f.key);
        if (values.length > 0) {
          result.push({ type: f.type, key: f.key, value: values });
        }
      } else if (f.type === "radio") {
        const values = searchParams.getAll(f.key);
        if (values.length > 0) {
          result.push({ type: f.type, key: f.key, value: values });
        }
      } else if (f.type === "radios_with_range") {
        const min = searchParams.get(`min_${f.key}`);
        const max = searchParams.get(`max_${f.key}`);
        if (min || max) {
          const range: { min?: number; max?: number } = {};
          if (min) range.min = Number(min);
          if (max) range.max = Number(max);
          result.push({ type: f.type, key: f.key, value: range });
        }
      }
    });
    return result;
  }, [searchParams, filterConfig]);

  const handleFiltersChange = useCallback((updated: FilterStateItem[]) => {
    console.log("updated", updated);
    const next = new URLSearchParams(searchParams.toString());
    
    // Clear existing filter params
    filterConfig.forEach(f => {
      if (f.type === "checkbox" || f.type === "radio") {
        next.delete(f.key);
      } else if (f.type === "radios_with_range") {
        next.delete(`min_${f.key}`);
        next.delete(`max_${f.key}`);
      }
    });
    
    // Set new filter params
    updated.forEach(filter => {
      if (filter.type === "checkbox" || filter.type === "radio") {
        const values = filter.value as string[];
        values.forEach(v => next.append(filter.key, v));
      } else if (filter.type === "radios_with_range") {
        const range = filter.value as { min?: number; max?: number };
        if (range.min !== undefined) next.set(`min_${filter.key}`, String(range.min));
        if (range.max !== undefined) next.set(`max_${filter.key}`, String(range.max));
      }
    });
    
    router.push(`?${next.toString()}`, { scroll: false });
  }, [router, searchParams, filterConfig]);

  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <main className="pt-6">
      <CategoryHeader
        currentCategory={currentCategory ?? { id: 0, name: "All Products", slug: "all", children: [], filterable_attributes: [] }}
        categoryPath={categoryPath}
        availableChildren={childCategories}
      />
      <FilterSortBar
        filtersOpen={filtersOpen}
        setFiltersOpen={setFiltersOpen}
        itemCount={productsResponse?.total || 0}
        filterConfig={filterConfig}
        activeFilters={activeFilters}
        onFiltersChange={handleFiltersChange}
      />
      <ProductGrid products={products} isLoading={isLoading} error={error} />
    </main>
  );
}
