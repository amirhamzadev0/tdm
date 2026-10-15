import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbSchema, buildMetadata, productSchema } from "@/lib/seo";
import { getProductPageViewModel, getProductSlugs } from "@/viewmodels/shop.viewmodel";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vm = await getProductPageViewModel(slug);
  if (!vm) return { title: "Product not found", robots: { index: false } };

  return buildMetadata({
    title: vm.product.name,
    description: `${vm.product.name} — ${vm.product.spec}`,
    path: `/shop/${vm.product.slug}`,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const vm = await getProductPageViewModel(slug);
  if (!vm) notFound();

  const { product, category, related } = vm;

  return (
    <>
      <JsonLd data={productSchema(product)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: product.name, path: `/shop/${product.slug}` },
        ])}
      />

      <PageHero
        title={product.name}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <Section>
        <ProductDetail product={product} category={category} />
      </Section>

      {related.length > 0 ? (
        <Section>
          <SectionHeading title="You may also like" />
          <ProductGrid products={related} />
        </Section>
      ) : null}
    </>
  );
}
