import type { Metadata } from "next";
import { CategoryPageView } from "@/components/shop/CategoryPageView";
import { buildMetadata } from "@/lib/seo";
import {
  getCategoryPageViewModel,
  getCategorySectionParams,
} from "@/viewmodels/category.viewmodel";

type SectionPageProps = { params: Promise<{ slug: string; sub: string }> };

export async function generateStaticParams() {
  return getCategorySectionParams();
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { slug, sub } = await params;
  const vm = await getCategoryPageViewModel(slug, sub);
  if (!vm?.subcategory) return { title: "Page not found", robots: { index: false } };

  return buildMetadata({
    title: vm.subcategory.name,
    description: `${vm.subcategory.summary}. Shop ${vm.subcategory.name.toLowerCase()} at device masters.`,
    path: `/category/${vm.category.slug}/${vm.subcategory.slug}`,
  });
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { slug, sub } = await params;
  return <CategoryPageView slug={slug} sub={sub} />;
}
