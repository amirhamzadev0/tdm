"use client";

import type { ReactNode } from "react";
import type { CartProduct } from "@/viewmodels/useCartViewModel";
import { Button, type ButtonVariant } from "../ui/Button";
import { useCart } from "./CartProvider";

interface AddToCartButtonProps {
  product: CartProduct;
  size?: "default" | "small";
  variant?: ButtonVariant;
  block?: boolean;
  label?: string;
  icon?: ReactNode;
}

export function AddToCartButton({
  product,
  size = "small",
  variant = "outline",
  block,
  label = "Buy Now",
  icon,
}: AddToCartButtonProps) {
  const { add } = useCart();

  return (
    <Button
      size={size}
      variant={variant}
      block={block}
      onClick={() => add(product)}
      aria-label={`${label}: add ${product.name} to cart`}
    >
      {icon}
      {label}
    </Button>
  );
}
