"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as Label from "@radix-ui/react-label";
import { Save } from "lucide-react";
import { useGetCategoriesQuery } from "@/state/categories-api";
import { useCreateProductMutation } from "@/state/products-api";
import { CategorySelectDropdown } from "@/components/admin/dropdown/CategorySelectDropdown";
import {
  ProductImageUpload,
  ImageItem,
} from "@/components/admin/products/ProductImageUpload";

const productSchema = z.object({
  title: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  stock_quantity: z.number().min(0, "Stock quantity must be a positive number"),
  category_id: z.number().nullable(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [priceDisplay, setPriceDisplay] = useState("");

  const { data: categories = [] } = useGetCategoriesQuery({ slug: "fashion" });
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      category_id: null,
    },
  });

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setPriceDisplay(value);
    const cents = Math.round(parseFloat(value || "0") * 100);
    setValue("price", cents);
  };

  const handleSubmitForm = async (data: ProductFormData) => {
    try {
      await createProduct({
        title: data.title,
        description: data.description || undefined,
        category_id: data.category_id || undefined,
        price: data.price,
        stock_quantity: data.stock_quantity,
        images: images.map((img) => img.file),
      }).unwrap();

      router.push("/admin/categories");
    } catch (error) {
      console.error("Failed to create product:", error);
      alert("Failed to create product. Please try again.");
    }
  };

  const handleSaveDraft = () => {
    alert("Save to draft functionality not implemented yet.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-title-lg text-[var(--admin-brand-secondary)]">
          Add New Product
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSubmit(handleSubmitForm)()}
            disabled={isLoading}
            className="admin-btn-primary"
          >
            {isLoading ? "Publishing..." : "Publish Product"}
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="admin-btn-secondary"
          >
            <Save className="w-4 h-4" />
            Save to draft
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column - Basic Details, Pricing, Inventory */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details Card */}
          <div className="admin-card p-6 space-y-5">
            <h2 className="text-body font-semibold text-[var(--admin-brand-secondary)]">
              Basic Details
            </h2>

            {/* Product Name */}
            <div className="space-y-2">
              <Label.Root
                htmlFor="title"
                className="text-body-sm font-medium text-[var(--admin-text-primary)]"
              >
                Product Name
              </Label.Root>
              <input
                id="title"
                type="text"
                {...register("title")}
                className="admin-input w-full"
                placeholder="Enter product name"
                aria-invalid={errors.title ? "true" : "false"}
              />
              {errors.title && (
                <p className="text-body-sm text-[var(--admin-error)]" role="alert">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Product Description */}
            <div className="space-y-2">
              <Label.Root
                htmlFor="description"
                className="text-body-sm font-medium text-[var(--admin-text-primary)]"
              >
                Product Description
              </Label.Root>
              <textarea
                id="description"
                {...register("description")}
                className="admin-input w-full min-h-[120px] resize-y"
                placeholder="Enter product description"
                rows={4}
              />
            </div>
          </div>

          {/* Pricing Card */}
          <div className="admin-card p-6 space-y-5">
            <h2 className="text-body font-semibold text-[var(--admin-brand-secondary)]">
              Pricing
            </h2>

            {/* Product Price */}
            <div className="space-y-2">
              <Label.Root
                htmlFor="price"
                className="text-body-sm font-medium text-[var(--admin-text-primary)]"
              >
                Product Price
              </Label.Root>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-grey)]">
                  €
                </span>
                <input
                  id="price"
                  type="text"
                  value={priceDisplay}
                  onChange={handlePriceChange}
                  className="admin-input w-full pl-7"
                  placeholder="0.00"
                  aria-invalid={errors.price ? "true" : "false"}
                />
              </div>
              {errors.price && (
                <p className="text-body-sm text-[var(--admin-error)]" role="alert">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          {/* Inventory Card */}
          <div className="admin-card p-6 space-y-5">
            <h2 className="text-body font-semibold text-[var(--admin-brand-secondary)]">
              Inventory
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Stock Quantity */}
              <div className="space-y-2">
                <Label.Root
                  htmlFor="stock_quantity"
                  className="text-body-sm font-medium text-[var(--admin-text-primary)]"
                >
                  Stock Quantity
                </Label.Root>
                <input
                  id="stock_quantity"
                  type="number"
                  min="0"
                  {...register("stock_quantity", { valueAsNumber: true })}
                  className="admin-input w-full"
                  placeholder="0"
                  aria-invalid={errors.stock_quantity ? "true" : "false"}
                />
                {errors.stock_quantity && (
                  <p className="text-body-sm text-[var(--admin-error)]" role="alert">
                    {errors.stock_quantity.message}
                  </p>
                )}
              </div>

              {/* Stock Status (derived from stock_quantity, read-only indicator) */}
              <div className="space-y-2">
                <Label.Root className="text-body-sm font-medium text-[var(--admin-text-primary)]">
                  Stock Status
                </Label.Root>
                <div
                  className={`admin-input w-full flex items-center ${
                    watch("stock_quantity") > 0
                      ? "text-[var(--admin-success)]"
                      : "text-[var(--admin-error)]"
                  }`}
                >
                  {watch("stock_quantity") > 0 ? "In Stock" : "Out of Stock"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Image Upload, Categories */}
        <div className="space-y-6">
          {/* Upload Product Image Card */}
          <div className="admin-card p-6">
            <h2 className="text-body font-semibold text-[var(--admin-brand-secondary)] mb-4">
              Upload Product Image
            </h2>
            <ProductImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={10}
            />
          </div>

          {/* Categories Card */}
          <div className="admin-card p-6">
            <h2 className="text-body font-semibold text-[var(--admin-brand-secondary)] mb-4">
              Categories
            </h2>
            <CategorySelectDropdown
              name="category_id"
              control={control}
              errors={errors}
              categories={categories}
              label="Product Categories"
              placeholder="Select your product category"
              noneOptionText="No Category"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
