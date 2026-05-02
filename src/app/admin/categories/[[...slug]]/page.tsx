"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { CategoryCard } from "@/components/admin/cards/CategoryCard";
import { DataTable } from "@/components/admin/data-table";
import {
  DataTableColumn,
  DataTableTab,
} from "@/components/admin/data-table/types";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  Category,
} from "@/state/categories-api";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  ProductWithCategory,
} from "@/state/products-api";
import { getImageUrl } from "@/lib/utils";
import {
  useFlatCategories,
  useCategoryPath,
  useChildCategories,
} from "@/app/(shop)/category/[...slug]/hooks";
import { CategoryFormData, CategoryFormModal } from "@/components/admin/modals/CategoryFormModal";
import {
  useGetAttributesQuery,
  useAssignAttributesToCategoryMutation,
} from "@/state/attributes-api";

const DEFAULT_ITEMS_PER_PAGE = 5;

const PAGE_SIZE_OPTIONS = [2, 5, 10, 20, 50];

const tabs: DataTableTab[] = [
  { label: "All Product", value: "all" },
  { label: "Featured Products", value: "featured" },
  { label: "On Sale", value: "on-sale" },
  { label: "Out of Stock", value: "out-of-stock" },
];

export default function CategoriesPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string[] | undefined;
  const slugArray = (params.slug as string[]) ?? [];
  const currentSlug = slugArray[slugArray.length - 1];
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategoriesQuery({slug: 'fashion'});

  const flatCategories = useFlatCategories(categories);

  // Find current category from slug
  const currentCategory = useMemo(() => {
    if (!slug || slug.length === 0) return undefined;
    return flatCategories.find(c => c.slug === currentSlug);
  }, [slug, flatCategories]);

  // Build breadcrumb path
  const categoryPath = useCategoryPath(flatCategories, currentCategory);

  // Get child categories of current category
  const childCategories = useChildCategories(currentCategory);

  // Get categories to display (children if selected, otherwise root categories)
  const displayCategories = currentCategory ? childCategories : categories;

  const {
    data: productsResponse,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useGetProductsQuery({
    skip: (currentPage - 1) * pageSize,
    limit: pageSize,
    search: searchQuery || undefined,
    category_ids: currentCategory?.id ? [currentCategory.id] : undefined,
    in_stock:
      activeTab === "out-of-stock"
        ? false
        : activeTab === "all"
        ? undefined
        : true,
  });

  const allProducts = productsResponse?.data || [];
  const totalProducts = productsResponse?.total || 0;

  const [deleteProduct] = useDeleteProductMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [createCategory, { isLoading: isCreatingCategory }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] = useUpdateCategoryMutation();
  const [assignAttributes] = useAssignAttributesToCategoryMutation();

  const { data: attributes = [] } = useGetAttributesQuery();

  const totalPages = Math.ceil(totalProducts / pageSize) || 1;

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // Handle category card click to navigate
  const handleCategoryClick = (clickedSlug: string) => {
    const newSlug = currentCategory
      ? [...(slug || []), clickedSlug]
      : [clickedSlug];
    router.push(`/admin/categories/${newSlug.join('/')}`);
  };

  // Handle breadcrumb click to navigate back
  const handleBreadcrumbClick = (categorySlug: string, index: number) => {
    if (index === categoryPath.length - 1) return; // Don't navigate if clicking current category
    const newSlug = categoryPath.slice(0, index + 1).map(c => c.slug);
    router.push(`/admin/categories/${newSlug.join('/')}`);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId).unwrap();
        refetchProducts();
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleCreateCategory = async (data: CategoryFormData) => {
    try {
      const newCategory = await createCategory({
        name: data.name,
        parent_id: data.parent_id,
      }).unwrap();
      if (data.attribute_ids?.length && newCategory?.id) {
        await assignAttributes({
          categoryId: newCategory.id,
          attribute_ids: data.attribute_ids,
        }).unwrap();
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to create category:", error);
      alert(error?.data?.message || "Failed to create category. Please try again.");
    }
  };

  const handleUpdateCategory = async (data: CategoryFormData) => {
    if (!editingCategory) return;
    try {
      await updateCategory({
        categoryId: editingCategory.id,
        category: { name: data.name, parent_id: data.parent_id },
      }).unwrap();
      if (data.attribute_ids !== undefined) {
        await assignAttributes({
          categoryId: editingCategory.id,
          attribute_ids: data.attribute_ids,
        }).unwrap();
      }
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error: any) {
      console.error("Failed to update category:", error);
      alert(error?.data?.message || "Failed to update category. Please try again.");
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(categoryId).unwrap();
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert("Failed to delete category. Please try again.");
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const columns: DataTableColumn<ProductWithCategory>[] = [
    {
      key: "id",
      label: "No.",
      width: "80px",
      render: (_value, _row, index) => (
        <span>{(currentPage - 1) * pageSize + index + 1}</span>
      ),
    },
    {
      key: "title",
      label: "Product",
      render: (_value, row) => {
        const imageUrl = row.images?.[0] ? getImageUrl(row.images[0]) : null;
        
        return (
          <div className="flex items-center gap-3">
            {row.images?.[0] ? (
              <div className="w-10 h-10 rounded-lg bg-[var(--admin-border-light)] overflow-hidden shrink-0">
                <Image
                  src={imageUrl as string}
                  alt={row.title}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-[var(--admin-border-light)] overflow-hidden shrink-0 flex items-center justify-center">
                <span className="text-[var(--admin-grey)] text-[10px]">IMG</span>
              </div>
            )}
            <span className="font-medium">{row.title}</span>
          </div>
        );
      },
    },
    {
      key: "created_at",
      label: "Created Date",
      render: (value) =>
        new Date(value as string).toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }),
    },
    {
      key: "stock_quantity",
      label: "Stock",
      render: (value) => (
        <span
          className={
            (value as number) > 0
              ? "text-[var(--admin-success)]"
              : "text-[var(--admin-error)]"
          }
        >
          {value as number}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Action",
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          <button className="text-[var(--admin-grey)] hover:text-[var(--admin-brand-primary)] transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteProduct(row.id)}
            className="text-[var(--admin-grey)] hover:text-[var(--admin-error)] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleSearchQuery = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSelectRow = (index: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === allProducts.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(allProducts.map((_, i) => i)));
    }
  };

  if (categoriesLoading || productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--admin-grey)]">Loading...</div>
      </div>
    );
  }

  console.log("editingCategory", editingCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-2 justify-between">
        <div className="flex items-center gap-4">
          {currentCategory && (
            <button
              onClick={() => router.push("/admin/categories")}
              className="text-[var(--admin-grey)] hover:text-[var(--admin-brand-primary)] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-title-lg text-[var(--admin-brand-secondary)]">
            {currentCategory ? currentCategory.name : "Discover"}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="admin-btn-primary"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
          <button className="admin-btn-secondary">
            More Action
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Breadcrumb display */}
      {categoryPath.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => router.push("/admin/categories")}
            className="text-[var(--admin-grey)] hover:text-[var(--admin-brand-primary)] transition-colors"
          >
            Categories
          </button>
          {categoryPath.map((cat, index) => (
            <div key={cat.id} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-[var(--admin-grey)]" />
              <button
                onClick={() => handleBreadcrumbClick(cat.slug, index)}
                className={`transition-colors ${
                  index === categoryPath.length - 1
                    ? "text-[var(--admin-brand-primary)] font-medium"
                    : "text-[var(--admin-grey)] hover:text-[var(--admin-brand-primary)]"
                }`}
              >
                {cat.name}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {displayCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              slug={cat.slug}
              onClick={handleCategoryClick}
              actions={[
                {
                  icon: <Pencil className="w-4 h-4" />,
                  name: "Edit",
                  handler: () => handleEditCategory(cat),
                },
                {
                  icon: <Trash2 className="w-4 h-4" />,
                  name: "Delete",
                  handler: () => handleDeleteCategory(cat.id),
                },
              ]}
            />
          ))}
        </div>
        {displayCategories.length > 6 && (
          <button className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-[var(--admin-bg-white)] shadow-md rounded-full flex items-center justify-center text-[var(--admin-text-primary)] hover:bg-[var(--admin-accent)] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <DataTable<ProductWithCategory>
        columns={columns}
        data={allProducts}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchPlaceholder="Search your product"
        searchValue={searchQuery}
        onSearch={handleSearchQuery}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
          pageSize,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          onPageSizeChange: handlePageSizeChange,
        }}
        selectable
        selectedRows={selectedRows}
        onSelectRow={handleSelectRow}
        onSelectAll={handleSelectAll}
        onFilter={() => {}}
        onAdd={() => {}}
        onMore={() => {}}
      />

      <CategoryFormModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
        categories={categories}
        attributes={attributes}
        initialData={editingCategory ? {
          name: editingCategory.name,
          parent_id: editingCategory.parent_id,
          attribute_ids: editingCategory.filterable_attributes?.map(attr => attr.id) || [],
        } : undefined}
        isLoading={editingCategory ? isUpdatingCategory : isCreatingCategory}
        mode={editingCategory ? "edit" : "create"}
      />
    </div>
  );
}
