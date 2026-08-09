"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save } from "lucide-react";
import { useGetCategoriesQuery } from "@/state/categories-api";
import { useCreateProductMutation } from "@/state/products-api";
import { useGetCategoryAttributesQuery } from "@/state/attributes-api";
import {
  Form,
  TextField,
  TextAreaField,
  NumberField,
  CurrencyField,
  CategoryTreeSelectField,
  DynamicFieldGroup,
  DynamicFieldDescriptor,
} from "@/components/form";
import {
  ProductImageUpload,
  ImageItem,
} from "@/components/admin/products/ProductImageUpload";

const productSchema = z.object({
  title: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  stock_quantity: z.number().min(0, "Stock quantity must be a positive number"),
  sku: z.string().optional(),
  category_id: z.number().nullable(),
  attribute_values: z.record(z.string(), z.number()),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<ImageItem[]>([]);

  const { data: categories = [] } = useGetCategoriesQuery({ slug: "fashion" });
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      sku: "",
      category_id: null,
      attribute_values: {},
    },
  });

  const categoryId = form.watch("category_id");
  const stockQuantity = form.watch("stock_quantity");

  const { data: categoryAttributesData } = useGetCategoryAttributesQuery(
    categoryId ?? 0,
    { skip: !categoryId }
  );
  const categoryAttributes = categoryAttributesData?.attributes ?? [];

  // Reset attribute selections whenever the category changes
  useEffect(() => {
    form.setValue("attribute_values", {});
  }, [categoryId, form]);

  const attributeDescriptors: DynamicFieldDescriptor[] = categoryAttributes.map(
    (attr) => ({
      key: attr.name,
      label: attr.name,
      options: attr.values.map((v) => ({ value: v.id, label: v.value })),
    })
  );

  const handleSubmitForm = async (data: ProductFormData) => {
    try {
      const attributeValueIds = Object.values(data.attribute_values);
      await createProduct({
        title: data.title,
        description: data.description || undefined,
        category_id: data.category_id || undefined,
        price: data.price,
        stock_quantity: data.stock_quantity,
        sku: data.sku || undefined,
        attribute_value_ids: attributeValueIds.length > 0 ? attributeValueIds : undefined,
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
            onClick={form.handleSubmit(handleSubmitForm)}
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
            <TextField<ProductFormData>
              name="title"
              label="Product Name"
              placeholder="Enter product name"
              required
            />
            <TextAreaField<ProductFormData>
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
            <CurrencyField<ProductFormData>
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
              <NumberField<ProductFormData>
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
            <TextField<ProductFormData>
              name="sku"
              label="SKU"
              placeholder="e.g. WLT-BLK-001"
            />
          </div>
        </div>

        {/* Right Column - Image Upload, Categories, Attributes */}
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
            <CategoryTreeSelectField<ProductFormData>
              name="category_id"
              categories={categories}
              label="Product Categories"
              placeholder="Select your product category"
              noneOptionText="No Category"
            />
          </div>

          {/* Product Attributes Card — only shown when a category is selected */}
          {categoryAttributes.length > 0 && (
            <div className="admin-card p-6 space-y-5">
              <h2 className="text-body font-semibold text-[var(--admin-brand-secondary)]">
                Product Attributes
              </h2>
              <DynamicFieldGroup<ProductFormData>
                name="attribute_values"
                descriptors={attributeDescriptors}
              />
            </div>
          )}
        </div>
      </Form>
    </div>
  );
}
