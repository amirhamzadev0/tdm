import { Suspense } from "react";
import { BrandMarquee } from "@/components/brands/BrandMarquee";
import { PageHero } from "@/components/layout/PageHero";
import { ProductCatalog } from "@/components/shop/ProductCatalog";
import { Section } from "@/components/ui/Section";
import { routeSeo } from "@/config/seo";
import { buildMetadata } from "@/lib/seo";
import { getShopBrands, getShopPageViewModel } from "@/viewmodels/shop.viewmodel";

export const metadata = buildMetadata({ ...routeSeo.shop, path: "/shop" });

type ShopPageProps = { searchParams: Promise<{ q?: string | string[] }> };

/** Reads the `?q=` search term (a runtime value), so it streams inside Suspense. */
async function ShopCatalogSection({ searchParams }: ShopPageProps) {
  const { q } = await searchParams;
  const search = typeof q === "string" ? q.slice(0, 100) : "";
  const { initial, categories } = await getShopPageViewModel(search);

  return <ProductCatalog initial={initial} categories={categories} initialSearch={search} />;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const brands = await getShopBrands();

  return (
    <>
      <PageHero
        title="Shop all devices"
        summary="New, used and refurbished mobiles, laptops, computers, accessories and gadgets."
      />
      <BrandMarquee brands={brands} />
      <Section>
        <Suspense fallback={<p className="catalog__status">Loading devices…</p>}>
          <ShopCatalogSection searchParams={searchParams} />
        </Suspense>
      </Section>
    </>
  );
}
