"use client";

import { capitalizeFirstLetter } from "@/lib/utils";

interface ProductDetailRowProps {
  label: string;
  value: string;
}

const ProductDetailRow = ({ label, value }: ProductDetailRowProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-light text-foreground">{capitalizeFirstLetter(label)}</h3>
      <p className="text-sm font-light text-muted-foreground">{value}</p>
    </div>
  );
};

export default ProductDetailRow;
