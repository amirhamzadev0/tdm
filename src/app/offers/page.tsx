import { PageHero } from "@/components/layout/PageHero";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Section } from "@/components/ui/Section";
import { routeSeo } from "@/config/seo";
import { buildMetadata } from "@/lib/seo";
import { getOffersPageViewModel } from "@/viewmodels/offer.viewmodel";

export const metadata = buildMetadata({ ...routeSeo.offers, path: "/offers" });

export default async function OffersPage() {
  const { saleItems } = await getOffersPageViewModel();

  return (
    <>
      <PageHero
        eyebrow="// Offers"
        title="Offers on devices"
        summary="Devices with a price drop right now."
      />
      <Section>
        <ProductGrid products={saleItems} />
      </Section>
    </>
  );
}
