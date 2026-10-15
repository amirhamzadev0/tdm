import Image from "next/image";
import type { Category } from "@/models/category";
import type { Product } from "@/models/product";
import { conditionLabel, discountPercent } from "@/utils/format";
import { AddToCartButton } from "../cart/AddToCartButton";
import { RichText } from "../content/RichText";
import { PriceTag } from "../ui/PriceTag";

interface ProductDetailProps {
  product: Product;
  category: Category | null;
}

export function ProductDetail({ product, category }: ProductDetailProps) {
  const percent = discountPercent(product.price, product.oldPrice);

  return (
    <div className="product-detail">
      <div className="product-detail__media">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 991px) 100vw, 600px"
          />
        ) : (
          <span>{product.name}</span>
        )}
      </div>

      <div>
        <div className="eyebrow">
          {category?.name ?? "Device"} · {conditionLabel(product.condition)}
        </div>
        <h1 className="product-detail__title">{product.name}</h1>
        <p className="product-detail__spec">{product.spec}</p>

        <div className="product-detail__price">
          <PriceTag price={product.price} oldPrice={product.oldPrice} />
          {percent > 0 ? <span className="product-detail__discount">-{percent}%</span> : null}
        </div>

        <AddToCartButton
          size="default"
          variant="primary"
          label="Add to cart"
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
          }}
        />

        <div className="product-detail__body">
          <RichText blocks={product.body} />
        </div>
      </div>
    </div>
  );
}
