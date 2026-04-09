"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Category } from "@/state/categories-api";

interface CategoryHeaderProps {
  currentCategory: Category;
  categoryPath: Category[];
  availableChildren: Category[];
}

const CategoryHeader = ({ currentCategory, categoryPath, availableChildren }: CategoryHeaderProps) => {
  const capitalizedCategory = currentCategory.name.charAt(0).toUpperCase() + currentCategory.name.slice(1);
  
  return (
    <section className="w-full px-6 mb-8">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {categoryPath.map((category, index) => (
                <div key={category.id} className="flex items-center">
                  <BreadcrumbItem>
                    {index === categoryPath.length - 1 ? (
                      <BreadcrumbPage>{category.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={`/category/${category.slug}`}>{category.name}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < categoryPath.length - 1 && <BreadcrumbSeparator />}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Children categories navigation */}
        {availableChildren.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-light text-muted-foreground mb-3">Browse Subcategories</h2>
            <div className="flex flex-wrap gap-2">
              {availableChildren.map((child) => (
                <Link
                  key={child.id}
                  href={`/category/${[...categoryPath.map(c => c.slug), child.slug].join("/")}`}
                  className="px-4 py-2 border border-border rounded-full text-sm font-light text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-foreground">
            {capitalizedCategory}
          </h1>
        </div>
    </section>
  );
};

export default CategoryHeader;