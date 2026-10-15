import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandMarquee } from "@/components/brands/BrandMarquee";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductCatalog } from "@/components/shop/ProductCatalog";
import { Section } from "@/components/ui/Section";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
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
  const vm = await getCategoryPageViewModel(slug);
  if (!vm) notFound();

  const { category, initial, categories } = vm;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: category.name, path: `/category/${category.slug}` },
        ])}
      />
      <PageHero
        eyebrow="// Category"
        title={category.name}
        summary={category.summary}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: category.name },
        ]}
      />
      <BrandMarquee
        brands={category.brands}
        title={`Trusted ${category.name.toLowerCase()} brands we work with`}
      />
      <Section>
        <ProductCatalog initial={initial} categories={categories} lockedCategory={category.slug} />
      </Section>
    </>
  );
}
