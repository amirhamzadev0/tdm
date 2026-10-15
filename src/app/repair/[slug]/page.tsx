import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingPanel } from "@/components/forms/BookingPanel";
import { PageHero } from "@/components/layout/PageHero";
import { RepairServiceDetail } from "@/components/repair/RepairServiceDetail";
import { RepairServiceList } from "@/components/repair/RepairServiceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import {
  getRepairServicePageViewModel,
  getRepairServiceSlugs,
} from "@/viewmodels/repair.viewmodel";

type RepairServicePageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getRepairServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RepairServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const vm = await getRepairServicePageViewModel(slug);
  if (!vm) return { title: "Service not found", robots: { index: false } };

  return buildMetadata({
    title: vm.service.title,
    description: vm.service.summary,
    path: `/repair/${vm.service.slug}`,
  });
}

export default async function RepairServicePage({ params }: RepairServicePageProps) {
  const { slug } = await params;
  const vm = await getRepairServicePageViewModel(slug);
  if (!vm) notFound();

  const { service, related, services } = vm;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Repair", path: "/repair" },
          { name: service.title, path: `/repair/${service.slug}` },
        ])}
      />
      <PageHero
        eyebrow="// Repair"
        title={service.title}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Repair", href: "/repair" },
          { label: service.title },
        ]}
      />

      <Section>
        <RepairServiceDetail service={service} />
      </Section>

      <Section>
        <SectionHeading title="Other repairs" />
        <RepairServiceList services={related} />
      </Section>

      <Section id="book">
        <BookingPanel
          heading="Book your repair slot."
          summary="Pick a time and we call to confirm within the hour."
          serviceTitles={services.map((item) => item.title)}
          defaultService={service.title}
        />
      </Section>
    </>
  );
}
