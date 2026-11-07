import { BadgePercent, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Category } from "@/models/category";
import type { Product } from "@/models/product";
import { conditionLabel, discountPercent, formatPrice } from "@/utils/format";
import { RichText } from "../content/RichText";
import { ProductActions, ProductStickyBar } from "./ProductActions";
import { ProductGallery } from "./ProductGallery";

interface ProductDetailProps {
  product: Product;
  category: Category | null;
}

export function ProductDetail({ product, category }: ProductDetailProps) {
  const percent = discountPercent(product.price, product.oldPrice);
  const section = category?.subcategories?.find(
    (item) => item.slug === product.subcategory && item.slug !== "devices",
  );
  const saving =
    product.oldPrice && product.oldPrice > product.price ? product.oldPrice - product.price : 0;
  const images = product.gallery?.length ? product.gallery : product.image ? [product.image] : [];
  const stars = product.rating ? Math.round(product.rating) : 0;
  const subtitle = product.spec
    .split("·")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" | ");

  return (
    <>
      <div className="pdp">
        <ProductGallery images={images} name={product.name} />

        <div className="pdp__info">
          <div className="pdp__head">
            <nav className="pdp__crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <ChevronRight size={14} aria-hidden="true" />
              {category ? (
                <>
                  <Link href={`/category/${category.slug}`}>{category.name}</Link>
                  <ChevronRight size={14} aria-hidden="true" />
                </>
              ) : null}
              {category && section ? (
                <>
                  <Link href={`/category/${category.slug}/${section.slug}`}>{section.name}</Link>
                  <ChevronRight size={14} aria-hidden="true" />
                </>
              ) : null}
              <span aria-current="page">{product.name}</span>
            </nav>
            <h1 className="pdp__title">{product.name}</h1>
            <p className="pdp__sub">{subtitle}</p>
            <p className="pdp__chips">
              <span>{conditionLabel(product.condition)}</span>
              {product.brand ? <span>{product.brand}</span> : null}
              <span>{product.id.toUpperCase()}</span>
            </p>
          </div>

          <div className="pdp__priceRow">
            <div className="pdp__price">
              <span className="pdp__now">{formatPrice(product.price)}</span>
              {saving > 0 && product.oldPrice ? (
                <s className="pdp__was">{formatPrice(product.oldPrice)}</s>
              ) : null}
            </div>
            {product.rating ? (
              <p className="pdp__rating" aria-label={`Rated ${product.rating} out of 5`}>
                <span aria-hidden="true">{"★".repeat(stars) + "☆".repeat(5 - stars)}</span>
                {product.rating.toFixed(1)}
              </p>
            ) : null}
          </div>

          <div className="pdp__offer">
            <div className="pdp__offer-head">
              <strong>
                {saving > 0
                  ? `You save ${formatPrice(saving)} (${percent}% off)`
                  : "Fully tested before sale"}
              </strong>
              <BadgePercent size={26} aria-hidden="true" />
            </div>
            <div className="pdp__offer-row">
              <span>Free diagnosis support from our repair desk</span>
              <Link href="/repair">
                Details <ChevronRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <ProductActions
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.image,
            }}
          />

          <Link href="/contact" className="pdp__bulk">
            <span>Corporate Gifting | Bulk Order</span>
            <span>Click Here</span>
          </Link>
        </div>
      </div>

      <ProductStickyBar
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
        }}
      />

      {product.body.length > 0 ? (
        <div className="pdp-details">
          <h2 className="pdp-details__title">Product details</h2>
          <RichText blocks={product.body} />
        </div>
      ) : null}
    </>
  );
}
