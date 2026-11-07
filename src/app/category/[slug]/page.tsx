import type { Metadata } from "next";
import { CategoryPageView } from "@/components/shop/CategoryPageView";
import { buildMetadata } from "@/lib/seo";
import { getCategoryPageViewModel, getCategorySlugs } from "@/viewmodels/category.viewmodel";

type CategoryPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vm = await getCategoryPageViewModel(slug);
  if (!vm) return { title: "Category not found", robots: { index: false } };

  return buildMetadata({
    title: vm.category.name,
    description: `${vm.category.summary}. Shop ${vm.category.name.toLowerCase()} at device masters.`,
    path: `/category/${vm.category.slug}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  return <CategoryPageView slug={slug} />;
}
