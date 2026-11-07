import { BookingPanel } from "@/components/forms/BookingPanel";
import { RepairGuide } from "@/components/home/RepairGuide";
import { CategoryBanner, CategoryHead } from "@/components/layout/CategoryBanner";
import { Section } from "@/components/ui/Section";
import { routeSeo } from "@/config/seo";
import { buildMetadata } from "@/lib/seo";
import { getRepairPageViewModel } from "@/viewmodels/repair.viewmodel";

export const metadata = buildMetadata({ ...routeSeo.repair, path: "/repair" });

export default async function RepairPage() {
  const { content, services } = await getRepairPageViewModel();

  return (
    <>
      <CategoryBanner id="repair" target="#repair-guide" />
      <CategoryHead
        title={content.heroTitle}
        summary={content.heroSummary}
        crumbs={[{ label: "Home", href: "/" }, { label: "Repair" }]}
      />

      <RepairGuide services={services} promises={content.guarantees} hideHead />

      <Section id="book">
        <BookingPanel
          heading="Book your repair slot."
          summary="Pick a service and a time. We call to confirm within the hour."
          serviceTitles={services.map((service) => service.title)}
        />
      </Section>
    </>
  );
}
