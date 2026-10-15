import { BookingPanel } from "@/components/forms/BookingPanel";
import { BrandMarquee } from "@/components/brands/BrandMarquee";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FlashSale } from "@/components/home/FlashSale";
import { HeroSection } from "@/components/home/HeroSection";
import { OfferingGrid } from "@/components/home/OfferingGrid";
import { TrustStrip } from "@/components/home/TrustStrip";
import { OfferGrid } from "@/components/offers/OfferGrid";
import { RepairProcess } from "@/components/repair/RepairProcess";
import { RepairServiceList } from "@/components/repair/RepairServiceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routeSeo } from "@/config/seo";
import { buildMetadata, organizationSchema } from "@/lib/seo";
import { getHomePageViewModel } from "@/viewmodels/home.viewmodel";
import { getRepairPageViewModel } from "@/viewmodels/repair.viewmodel";

export const metadata = buildMetadata({ ...routeSeo.home, path: "/", absoluteTitle: true });

export default async function HomePage() {
  const [home, repair] = await Promise.all([getHomePageViewModel(), getRepairPageViewModel()]);
  const { content } = home;

  return (
    <>
      <JsonLd data={organizationSchema()} />

      <HeroSection hero={content.hero} />
      <TrustStrip items={content.trust} />

      <Section>
        <SectionHeading title={content.offerings.heading} />
        <OfferingGrid items={content.offerings.items} />
      </Section>

      <BrandMarquee brands={home.brands} />

      <Section id="categories">
        <SectionHeading title={content.categoriesHeading} />
        <CategoryGrid categories={home.categories} />
      </Section>

      <Section id="sale">
        <SectionHeading title={content.flashSaleHeading} />
        <FlashSale products={home.saleItems} />
      </Section>

      <Section id="shop">
        <SectionHeading title={content.featuredHeading} />
        <ProductGrid products={home.featured} />
        <div className="section-footer">
          <ButtonLink href="/shop" variant="outline">
            Browse the full catalogue
          </ButtonLink>
        </div>
      </Section>

      <Section id="repair" tone="navy">
        <SectionHeading title={content.repairHeading} summary={content.repairSummary} />
        <RepairProcess steps={repair.content.process} />
        <RepairServiceList services={home.repairServices} />
      </Section>

      <Section id="offers">
        <SectionHeading title={content.offersHeading} />
        <OfferGrid offers={home.offers} />
      </Section>

      <Section id="book">
        <BookingPanel
          heading={content.booking.heading}
          headingAccent={content.booking.headingAccent}
          summary={content.booking.summary}
          serviceTitles={home.repairServices.map((service) => service.title)}
        />
      </Section>
    </>
  );
}
