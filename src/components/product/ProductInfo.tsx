"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import CategoryHeader from "../category/CategoryHeader";
import { Category } from "@/state/categories-api";
import { ProductWithCategory } from "@/state/products-api";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { addToCart } from "@/state/cart-slice";
import { setGuestUser } from "@/state/auth-slice";
import { useCreateGuestUserMutation } from "@/state/users-api";
import { useAddCartItemMutation } from "@/state/cart-api";
import { getImageUrl } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";

interface ProductInfoProps {
  product?: ProductWithCategory;
  currentCategory?: Category;
  categoryPath: Category[];
  availableChildren: Category[];
}

const formatPrice = (cents: number) =>
  `€${(cents / 100).toLocaleString("en-IE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const ProductInfo = ({
  product,
  currentCategory,
  categoryPath,
  availableChildren,
}: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addToBagTrigger, setAddToBagTrigger] = useState(0);

  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [createGuestUser] = useCreateGuestUserMutation();
  const [addCartItem] = useAddCartItemMutation();

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToBag = async () => {
    if (!product) return;

    setIsAdding(true);
    try {
      if (!isAuthenticated) {
        try {
          const guestData = await createGuestUser().unwrap();
          dispatch(
            setGuestUser({
              user: {
                id: guestData.user.id,
                is_guest: guestData.user.is_guest,
                created_at: guestData.user.created_at,
                guest_expires_at: guestData.user.guest_expires_at ?? null,
              },
            })
          );
        } catch {
          toast({
            title: "Could not initialise session. Please try again.",
            variant: "error",
          });
          return;
        }
      }

      dispatch(
        addToCart({
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] ? getImageUrl(product.images[0]) : "",
          categoryName: product.category?.name,
          quantity,
        })
      );

      addCartItem({ productId: product.id, quantity }).catch(() => {
        toast({
          title: "Item added locally. Sync will retry on next visit.",
          variant: "default",
        });
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Debounce rapid "Add to Bag" clicks so we don't fire duplicate add/sync requests.
  const debouncedAddToBagTrigger = useDebounce(addToBagTrigger, 400);
  const isFirstAddToBagRender = useRef(true);

  useEffect(() => {
    if (isFirstAddToBagRender.current) {
      isFirstAddToBagRender.current = false;
      return;
    }
    handleAddToBag();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedAddToBagTrigger]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb - Show only on desktop */}
      <div className="hidden lg:block">
        {currentCategory && (
          <CategoryHeader
            currentCategory={currentCategory}
            categoryPath={categoryPath}
            availableChildren={availableChildren}
          />
        )}
      </div>

      {/* Product title and price */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            {/* <p className="text-sm font-light text-muted-foreground mb-1">Earrings</p>
            <h1 className="text-2xl md:text-3xl font-light text-foreground">Pantheon</h1> */}
            {product?.category?.name && (
              <p className="text-sm font-light text-muted-foreground mb-1">
                {product.category.name}
              </p>
            )}
            <h1 className="text-2xl md:text-3xl font-light text-foreground">
              {product?.title ?? ""}
            </h1>
          </div>
          <div className="text-right">
            {/* <p className="text-xl font-light text-foreground">€2,850</p> */}
            {product?.price != null && (
              <p className="text-xl font-light text-foreground">
                {formatPrice(product.price)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Product Attributes */}
      {product?.attributes && product.attributes.filter((a) =>
        ['material', 'accents', 'weight'].includes(a.name.toLowerCase())
      ).length > 0 && (
        <div className="space-y-4 py-4 border-border">
          {product.attributes
            .filter((a) => ['material', 'accents', 'weight'].includes(a.name.toLowerCase()))
            .map((attr) => (
              <div key={attr.value_id} className="space-y-1">
                <h3 className="text-sm font-light text-foreground">
                  {attr.name}
                </h3>
                <p className="text-sm font-light text-muted-foreground">
                  {attr.value}
                </p>
              </div>
            ))}
        {/* 
        <div className="space-y-2">
          <h3 className="text-sm font-light text-foreground">Weight</h3>
          <p className="text-sm font-light text-muted-foreground">4.2g per earring</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-light text-foreground">Editor's notes</h3>
          <p className="text-sm font-light text-muted-foreground italic">"A modern interpretation of classical architecture, these 
earrings bridge timeless elegance with contemporary minimalism."</p>
        </div> */}
        </div>
      )}
      {/* Stock status */}

      {product?.stock_quantity &&
        <div className="space-y-2 ">
          <h3 className="text-sm font-light text-foreground">In Stock</h3>
          <p className="text-sm font-light text-muted-foreground">{product.stock_quantity > 0? `${product.stock_quantity} available` : "Out of stock"}</p>
        </div>
      }


      <div className="border-t"></div>

      {/* Quantity and Add to Cart */}
      <div className="space-y-4 pt-2  border-border">
        <div className="flex items-center gap-4">
          <span className="text-sm font-light text-foreground">Quantity</span>
          <div className="flex items-center border border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={decrementQuantity}
              className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="h-10 flex items-center px-4 text-sm font-light min-w-12 justify-center border-l border-r border-border">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={incrementQuantity}
              className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-light rounded-none"
          onClick={() => setAddToBagTrigger((prev) => prev + 1)}
          disabled={isAdding || !product || product.stock_quantity <= 0}
        >
          {isAdding ? "Adding..." : "Add to Bag"}
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;