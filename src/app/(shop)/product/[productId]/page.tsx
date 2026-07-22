"use client";

import Link from "next/link";
import ProductImageGallery from "../../../../components/product/ProductImageGallery";
import ProductInfo from "../../../../components/product/ProductInfo";
import ProductDescription from "../../../../components/product/ProductDescription";
import ProductCarousel from "../../../../components/content/ProductCarousel";
import { useCategoryPath } from "../../category/[...slug]/hooks";
import { useChildCategories } from "../../category/[...slug]/hooks";
import { useFlatCategories } from "../../category/[...slug]/hooks";
import { useGetCategoriesQuery } from "@/state/categories-api";
import { useParams } from "next/navigation";
import { useGetProductQuery } from "@/state/products-api";
import CategoryHeader from "@/components/category/CategoryHeader";

interface ProductDetailPageProps {
  params: {
    productId: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  console.log("productId", productId);
  const { data: categories = [], isLoading: categoriesLoading } =
      useGetCategoriesQuery({slug: 'fashion'});

  const { data: product, isLoading: productLoading } =
      useGetProductQuery(productId);
  console.log("product", product);
  const flatCategories = useFlatCategories(categories);
  const categoryPath = useCategoryPath(flatCategories, product?.category); // categories/wallets/bi-fold
  const childCategories = useChildCategories(product?.category); 

  // console.log("categoryPath", categoryPath);
  // console.log("childCategories", childCategories);

  return (
    <main className="pt-6">
      <section className="w-full px-6">
        {/* Breadcrumb - Show above image on smaller screens */}
        <div className="lg:hidden mb-6">
          <CategoryHeader
            currentCategory={product?.category ?? { id: 0, name: "All Products", slug: "all", children: [], filterable_attributes: [] }}
            categoryPath={categoryPath}
            availableChildren={childCategories}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <ProductImageGallery images={product?.images} />
          
          <div className="lg:pl-12 mt-8 lg:mt-0 lg:sticky lg:top-6 lg:h-fit">
            <ProductInfo 
              product={product}
              currentCategory={product?.category}
              categoryPath={categoryPath}
              availableChildren={childCategories}
            />
            {product && <ProductDescription product={product} />}
          </div>
        </div>
      </section>
      
      {/* <section className="w-full mt-16 lg:mt-24">
        <div className="mb-4 px-6">
          <h2 className="text-sm font-light text-foreground">You might also like</h2>
        </div>
        <ProductCarousel />
      </section>
      
      <section className="w-full">
        <div className="mb-4 px-6">
          <h2 className="text-sm font-light text-foreground">Our other Earrings</h2>
        </div>
        <ProductCarousel />
      </section> */}
    </main>
  );
}
