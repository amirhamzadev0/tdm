import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/models/product";
import { conditionLabel, discountPercent } from "@/utils/format";
import { AddToCartButton } from "../cart/AddToCartButton";
import { PriceTag } from "../ui/PriceTag";

export function ProductCard({ product }: { product: Product }) {
  const percent = discountPercent(product.price, product.oldPrice);

  return (
    <article className="product-card card card--interactive">
      <Link
        href={`/shop/${product.slug}`}
        className="product-card__media"
        aria-label={product.name}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 767px) 100vw, 300px"
          />
        ) : (
          <span>{product.name}</span>
        )}
        <span className="product-card__tag">{conditionLabel(product.condition)}</span>
        {percent > 0 ? <span className="product-card__discount">-{percent}%</span> : null}
      </Link>

      <h3 className="product-card__name">
        <Link href={`/shop/${product.slug}`}>{product.name}</Link>
      </h3>
      <p className="product-card__spec">{product.spec}</p>
      <PriceTag price={product.price} oldPrice={product.oldPrice} />
      <AddToCartButton
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
        }}
      />
    </article>
  );
}
