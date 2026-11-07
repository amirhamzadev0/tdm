import { ProductRail } from "@/components/home/ProductRail";
import { CategoryBanner, CategoryHead } from "@/components/layout/CategoryBanner";
import { ProductCard } from "@/components/shop/ProductCard";
import { routeSeo } from "@/config/seo";
import { buildMetadata } from "@/lib/seo";
import { getPartsPageViewModel } from "@/viewmodels/parts.viewmodel";

export const metadata = buildMetadata({ ...routeSeo.parts, path: "/parts" });

export default async function PartsPage() {
  const rows = await getPartsPageViewModel();

  return (
    <>
      <CategoryBanner id="parts" target={rows[0] ? `#${rows[0].id}` : undefined} />
      <CategoryHead
        title="Spare parts"
        summary="Screens, batteries, RAM, SSDs and more for your mobile, laptop and computer."
        crumbs={[{ label: "Home", href: "/" }, { label: "Parts" }]}
      />
      {rows.map((row) => (
        <ProductRail key={row.id} id={row.id} title={row.title} href={row.href}>
          {row.items.map((product) => (
            <ProductCard key={product.id} product={product} ribbon="Spare part" />
          ))}
        </ProductRail>
      ))}
    </>
  );
}
