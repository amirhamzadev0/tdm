import { BookingPanel } from "@/components/forms/BookingPanel";
import { BrandMarquee } from "@/components/brands/BrandMarquee";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { HeroSection } from "@/components/home/HeroSection";
import { OfferingCards } from "@/components/home/OfferingCards";
import { RepairGuide } from "@/components/home/RepairGuide";
import { ProductRail } from "@/components/home/ProductRail";
import { TrustStrip } from "@/components/home/TrustStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routeSeo } from "@/config/seo";
import { buildMetadata, organizationSchema } from "@/lib/seo";
import { discountPercent } from "@/utils/format";
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
      <CategoryShowcase />

      <ProductRail id="new-arrivals" title="New Arrivals" href="/shop">
        {home.newArrivals.map((product) => (
          <ProductCard key={product.id} product={product} ribbon="Newly launched" />
        ))}
      </ProductRail>

      <ProductRail id="best-sellers" title="Best Sellers" href="/shop">
        {home.bestSellers.map((product) => (
          <ProductCard key={product.id} product={product} ribbon="Best seller" />
        ))}
      </ProductRail>

      <ProductRail id="offers" title="Offers" href="/shop">
        {home.dealItems.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            ribbon={`${discountPercent(product.price, product.oldPrice)}% off`}
          />
        ))}
      </ProductRail>

      <Section>
        <SectionHeading title={content.offerings.heading} />
        <OfferingCards items={content.offerings.items} />
      </Section>

      <BrandMarquee brands={home.brands} />

      <Section id="shop">
        <SectionHeading title={content.featuredHeading} />
        <ProductGrid products={home.featured} />
        <div className="section-footer">
          <ButtonLink href="/shop" variant="outline">
            Browse the full catalogue
          </ButtonLink>
        </div>
      </Section>

      <RepairGuide services={home.repairServices} promises={repair.content.guarantees} />

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
