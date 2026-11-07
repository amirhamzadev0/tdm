import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product, ProductCondition } from "@/models/product";
import { discountPercent, formatPrice } from "@/utils/format";
import { AddToCartButton } from "../cart/AddToCartButton";

const ribbonLabels: Record<ProductCondition, string> = {
  new: "New arrival",
  used: "Pre-owned",
};

function specParts(spec: string): string[] {
  return spec
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function ProductCard({ product, ribbon }: { product: Product; ribbon?: string }) {
  const percent = discountPercent(product.price, product.oldPrice);
  const href = `/shop/${product.slug}`;
  const stars = product.rating ? Math.round(product.rating) : 0;

  return (
    <article className="pc2" data-condition={product.condition}>
      <Link href={href} className="pc2__media" aria-label={product.name}>
        {product.image ? (
          <Image
            src={product.image}
            alt=""
            fill
            sizes="(max-width: 767px) 80vw, 320px"
            className="pc2__image"
          />
        ) : (
          <span className="pc2__placeholder">{product.name}</span>
        )}
      </Link>

      <span className="pc2__ribbon">{ribbon ?? ribbonLabels[product.condition]}</span>

      <div className="pc2__body">
        <h3 className="pc2__name">
          <Link href={href}>{product.name}</Link>
        </h3>
        <p className="pc2__meta">
          {product.brand ? `${product.brand} · ` : ""}
          {product.id.toUpperCase()}
        </p>

        {product.rating ? (
          <p className="pc2__rating" aria-label={`Rated ${product.rating} out of 5`}>
            <span aria-hidden="true">{"★".repeat(stars) + "☆".repeat(5 - stars)}</span>
            {product.rating.toFixed(1)}
          </p>
        ) : null}

        <hr className="pc2__divider" />

        <p className="pc2__off">{percent > 0 ? `${percent}% Off` : "Best price"}</p>
        <div className="pc2__price-row">
          <div className="pc2__price">
            <span className="pc2__now">{formatPrice(product.price)}</span>
            {product.oldPrice && product.oldPrice > product.price ? (
              <s className="pc2__was">{formatPrice(product.oldPrice)}</s>
            ) : null}
          </div>
        </div>

        <ul className="pc2__specs">
          {specParts(product.spec).map((part) => (
            <li key={part}>{part}</li>
          ))}
        </ul>

        <div className="pc2__buttons">
          <Link href={href} className="btn btn--primary btn--small pc2__buy">
            Buy Now
          </Link>
          <AddToCartButton
            label="Add to cart"
            icon={<ShoppingCart size={16} aria-hidden="true" />}
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.image,
            }}
          />
        </div>
      </div>
    </article>
  );
}
