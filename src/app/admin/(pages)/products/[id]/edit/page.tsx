"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { ArrowLeft, X } from "lucide-react";
import { useGetCategoriesQuery } from "@/state/categories-api";
import { useGetProductQuery, useUpdateProductMutation } from "@/state/products-api";
import {
  Form,
  TextField,
  TextAreaField,
  NumberField,
  CurrencyField,
  CategoryTreeSelectField,
} from "@/components/form";
import { getImageUrl } from "@/lib/utils";

const productEditSchema = z.object({
  title: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  stock_quantity: z.number().min(0, "Stock quantity must be a positive number"),
  sku: z.string().optional(),
  category_id: z.number().nullable(),
});

type ProductEditFormData = z.infer<typeof productEditSchema>;

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { data: product, isLoading: isProductLoading } = useGetProductQuery(productId);
  const { data: categories = [] } = useGetCategoriesQuery({ slug: "fashion" });
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const form = useForm<ProductEditFormData>({
    resolver: zodResolver(productEditSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      sku: "",
      category_id: null,
    },
  });

  const stockQuantity = form.watch("stock_quantity");

  // Populate form once product data loads — CurrencyField syncs its display off
  // field.value, so reset() here correctly re-derives the price display string.
  useEffect(() => {
    if (!product) return;
    form.reset({
      title: product.title,
      description: product.description ?? "",
      price: product.price,
      stock_quantity: product.stock_quantity,
      sku: product.sku ?? "",
      category_id: product.category_id ?? null,
    });
  }, [product, form]);

  const handleSubmitForm = async (data: ProductEditFormData) => {
    try {
      await updateProduct({
        productId,
        product: {
          title: data.title,
          description: data.description || undefined,
          category_id: data.category_id || undefined,
          price: data.price,
          stock_quantity: data.stock_quantity,
          sku: data.sku || undefined,
        },
      }).unwrap();
      router.push("/admin/categories");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  const handleCancel = () => {
    router.push("/admin/categories");
  };

  if (isProductLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--admin-grey)]">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--admin-error)]">Product not found.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="text-[var(--admin-grey)] hover:text-[var(--admin-brand-primary)] transition-colors"
            aria-label="Back to categories"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-title-lg text-[var(--admin-brand-secondary)]">
              Edit Product
            </h1>
            <p className="text-body-sm text-[var(--admin-grey)] mt-0.5">
              {product.sku ? `SKU: ${product.sku}` : product.id}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={form.handleSubmit(handleSubmitForm)}
            disabled={isUpdating}
            className="admin-btn-primary"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="admin-btn-secondary"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>

      <Form
        form={form}
        onSubmit={handleSubmitForm}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column - Basic Details, Pricing, Inventory */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details Card */}
          <div className="admin-card p-6 space-y-5">
            <h2 className="text-body font-semibold text-[var(--admin-brand-secondary)]">
              Basic Details
            </h2>
            <TextField<ProductEditFormData>
              name="title"
              label="Product Name"
              placeholder="Enter product name"
              required
            />
            <TextAreaField<ProductEditFormData>
              name="description"
              label="Product Description"
              placeholder="Enter product description"
            />
          </div>

          {/* Pricing Card */}
          <div className="admin-card p-6 space-y-5">
            <h2 className="text-body font-semibold text-[var(--admin-brand-secondary)]">
              Pricing
            </h2>
            <CurrencyField<ProductEditFormData>
              name="price"
              label="Product Price"
              required
            />
          </div>

          {/* Inventory Card */}
          <div className="admin-card p-6 space-y-5">
            <h2 className="text-body font-semibold text-[var(--admin-brand-secondary)]">
              Inventory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <NumberField<ProductEditFormData>
                name="stock_quantity"
                label="Stock Quantity"
                min={0}
                placeholder="0"
              />
              {/* Stock Status — derived display, not a form field */}
              <div className="space-y-2">
                <label className="text-body-sm font-medium text-[var(--admin-text-primary)]">
                  Stock Status
                </label>
                <div
                  className={`admin-input w-full flex items-center ${
                    stockQuantity > 0
                      ? "text-[var(--admin-success)]"
                      : "text-[var(--admin-error)]"
                  }`}
                >
                  {stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                </div>
              </div>
            </div>
            <TextField<ProductEditFormData>
              name="sku"
              label="SKU"
              placeholder="e.g. WLT-BLK-001"
            />
          </div>
        </div>

        {/* Right Column - Images, Categories, Attributes */}
        <div className="space-y-6">
          {/* Existing Product Images Card */}
          {product.images.length > 0 && (
            <div className="admin-card p-6">
              <h2 className="text-body font-semibold text-[var(--admin-brand-secondary)] mb-4">
                Product Images
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {product.images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg border border-[var(--admin-border)] overflow-hidden"
                  >
                    <Image
                      src={getImageUrl(imageUrl) as string}
                      alt={`${product.title} image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Card */}
          <div className="admin-card p-6">
            <h2 className="text-body font-semibold text-[var(--admin-brand-secondary)] mb-4">
              Categories
            </h2>
            <CategoryTreeSelectField<ProductEditFormData>
              name="category_id"
              categories={categories}
              label="Product Categories"
              placeholder="Select your product category"
              noneOptionText="No Category"
            />
          </div>

          {/* Product Attributes Card — read-only display */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="admin-card p-6 space-y-4">
              <h2 className="text-body font-semibold text-[var(--admin-brand-secondary)]">
                Product Attributes
              </h2>
              <div className="space-y-3">
                {product.attributes.map((attr) => (
                  <div
                    key={attr.attribute_id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-body-sm font-medium text-[var(--admin-text-primary)]">
                      {attr.name}
                    </span>
                    <span className="text-body-sm text-[var(--admin-grey)] bg-[var(--admin-accent)] px-3 py-1 rounded-full">
                      {attr.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Form>
    </div>
  );
}
