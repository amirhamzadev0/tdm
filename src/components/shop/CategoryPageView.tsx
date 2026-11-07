import { notFound } from "next/navigation";
import { BrandMarquee } from "@/components/brands/BrandMarquee";
import { CategoryBanner, CategoryHead } from "@/components/layout/CategoryBanner";
import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/ui/Section";
import { getCategoryBanner } from "@/config/banners";
import { breadcrumbSchema } from "@/lib/seo";
import { getCategoryPageViewModel } from "@/viewmodels/category.viewmodel";
import { ProductCatalog } from "./ProductCatalog";
import { SubcategoryNav } from "./SubcategoryNav";

/** A category page, or one of its sections (e.g. Mobile Parts) when `sub` is given. */
export async function CategoryPageView({ slug, sub }: { slug: string; sub?: string }) {
  const vm = await getCategoryPageViewModel(slug, sub);
  if (!vm) notFound();

  const { category, subcategory, initial, categories } = vm;
  const title = subcategory?.name ?? category.name;
  const summary = subcategory?.summary ?? category.summary;
  const categoryPath = `/category/${category.slug}`;
  // Every parts section shares the Parts banner; the other pages use their category's banner.
  const bannerId = subcategory?.slug === "parts" ? "parts" : category.slug;

  const crumbs = subcategory
    ? [
        { label: "Home", href: "/" },
        { label: "Shop", href: "/shop" },
        { label: category.name, href: categoryPath },
        { label: subcategory.name },
      ]
    : [{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: category.name }];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: category.name, path: categoryPath },
          ...(subcategory
            ? [{ name: subcategory.name, path: `${categoryPath}/${subcategory.slug}` }]
            : []),
        ])}
      />
      {getCategoryBanner(bannerId) ? (
        <>
          <CategoryBanner id={bannerId} />
          <CategoryHead title={title} summary={summary} crumbs={crumbs} />
        </>
      ) : (
        <PageHero eyebrow="// Category" title={title} summary={summary} crumbs={crumbs} />
      )}
      <SubcategoryNav category={category} active={subcategory?.slug} />
      <BrandMarquee
        brands={category.brands}
        title={`Trusted ${title.toLowerCase()} brands we work with`}
      />
      <Section id="products">
        <ProductCatalog
          initial={initial}
          categories={categories}
          lockedCategory={category.slug}
          lockedSubcategory={subcategory?.slug}
        />
      </Section>
    </>
  );
}
