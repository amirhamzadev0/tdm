import { PageHero } from "@/components/layout/PageHero";
import { OfferGrid } from "@/components/offers/OfferGrid";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routeSeo } from "@/config/seo";
import { buildMetadata } from "@/lib/seo";
import { getOffersPageViewModel } from "@/viewmodels/offer.viewmodel";

export const metadata = buildMetadata({ ...routeSeo.offers, path: "/offers" });

export default async function OffersPage() {
  const { offers, saleItems } = await getOffersPageViewModel();

  return (
    <>
      <PageHero
        eyebrow="// Offers"
        title="Codes that save you money"
        summary="Copy a code and mention it when you book or buy."
      />
      <Section>
        <OfferGrid offers={offers} />
      </Section>
      <Section>
        <SectionHeading title="Discounted devices" />
        <ProductGrid products={saleItems} />
      </Section>
    </>
  );
}
