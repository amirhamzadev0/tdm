import Link from "next/link";
import { getCategoryBanner } from "@/config/banners";
import { BannerPicture } from "../ui/BannerPicture";

/**
 * Full-width banner at the top of a category page. The artwork carries its own "Shop now" tab,
 * so the whole banner scrolls down to `target` (the products by default). Returns nothing for categories without art.
 */
export function CategoryBanner({ id, target = "#products" }: { id: string; target?: string }) {
  const banner = getCategoryBanner(id);
  if (!banner) return null;

  return (
    <section className="cat-banner" aria-label={banner.label}>
      <Link
        href={target}
        className="cat-banner__frame"
        style={{ background: banner.bg }}
        aria-label={`${banner.label}: view products`}
      >
        <BannerPicture
          src={banner.src}
          mobileSrc={banner.mobileSrc}
          alt=""
          priority
          className="cat-banner__image"
        />
      </Link>
    </section>
  );
}

interface CategoryHeadProps {
  title: string;
  summary?: string;
  crumbs: { label: string; href?: string }[];
}

/** Breadcrumb, title and one-line summary shown under a category banner. */
export function CategoryHead({ title, summary, crumbs }: CategoryHeadProps) {
  return (
    <header className="cat-head">
      <nav className="cat-head__crumbs" aria-label="Breadcrumb">
        {crumbs.map((crumb, index) => (
          <span key={crumb.label}>
            {index > 0 ? " / " : ""}
            {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : crumb.label}
          </span>
        ))}
      </nav>
      <h1 className="cat-head__title">{title}</h1>
      {summary ? <p className="cat-head__summary">{summary}</p> : null}
    </header>
  );
}
