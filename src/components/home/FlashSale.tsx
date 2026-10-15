import type { Product } from "@/models/product";
import { formatPrice } from "@/utils/format";
import { AddToCartButton } from "../cart/AddToCartButton";
import { ProductCard } from "../shop/ProductCard";
import { SaleClock } from "./SaleClock";

/** The first product is the highlighted deal; the rest render as regular cards. */
export function FlashSale({ products }: { products: Product[] }) {
  const [featured, ...others] = products;
  if (!featured) return null;

  return (
    <div className="flash-grid">
      <article className="flash-feature">
        <h3 className="flash-feature__name">{featured.name}</h3>
        <SaleClock />
        <div className="flash-feature__photo">{featured.name}</div>
        <p className="flash-feature__spec">{featured.spec}</p>
        <AddToCartButton
          product={{
            id: featured.id,
            slug: featured.slug,
            name: featured.name,
            price: featured.price,
          }}
          size="default"
          variant="ghost"
          block
          label={`Buy Now ${formatPrice(featured.price)}`}
        />
      </article>
      {others.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
