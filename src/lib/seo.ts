import "server-only";
import type { Metadata } from "next";
import { site } from "@/config/site";
import type { Product } from "@/models/product";

export const siteUrl = process.env.SITE_URL ?? "http://127.0.0.1:3120";

export interface PageMeta {
  title: string;
  description: string;
  /** Route path starting with "/". */
  path: string;
  /** Skip the "%s | site name" title template. */
  absoluteTitle?: boolean;
  noIndex?: boolean;
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteUrl).toString();
}

export function buildMetadata({
  title,
  description,
  path,
  absoluteTitle,
  noIndex,
}: PageMeta): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    robots: noIndex ? { index: false, follow: false } : undefined,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: site.name,
      type: "website",
    },
  };
}

export type JsonLdObject = Record<string, unknown>;

export function organizationSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ComputerStore",
    name: site.name,
    description: site.description,
    url: siteUrl,
    telephone: site.phone,
    email: site.email,
    address: site.address,
    openingHours: "Mo-Su 10:00-20:00",
    sameAs: site.social.map((link) => link.href),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

const conditionSchemaUrl = {
  new: "https://schema.org/NewCondition",
  used: "https://schema.org/UsedCondition",
  refurbished: "https://schema.org/RefurbishedCondition",
} as const;

export function productSchema(product: Product): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.spec,
    url: absoluteUrl(`/shop/${product.slug}`),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "PKR",
      itemCondition: conditionSchemaUrl[product.condition],
      availability: "https://schema.org/InStock",
    },
  };
}
