import { BookingPanel } from "@/components/forms/BookingPanel";
import { PageHero } from "@/components/layout/PageHero";
import { RepairGuarantees } from "@/components/repair/RepairGuarantees";
import { RepairProcess } from "@/components/repair/RepairProcess";
import { RepairServiceList } from "@/components/repair/RepairServiceList";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { routeSeo } from "@/config/seo";
import { buildMetadata } from "@/lib/seo";
import { getRepairPageViewModel } from "@/viewmodels/repair.viewmodel";

export const metadata = buildMetadata({ ...routeSeo.repair, path: "/repair" });

export default async function RepairPage() {
  const { content, services } = await getRepairPageViewModel();

  return (
    <>
      <PageHero eyebrow="// Repair" title={content.heroTitle} summary={content.heroSummary} />

      <Section tone="navy">
        <RepairProcess steps={content.process} />
        <RepairServiceList services={services} />
      </Section>

      <Section>
        <SectionHeading title="No surprises" />
        <RepairGuarantees items={content.guarantees} />
      </Section>

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
