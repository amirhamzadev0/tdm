import Link from "next/link";
import { MagneticText } from "../ui/MagneticText";
import { StarGrid } from "../ui/StarGrid";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  summary?: string;
  crumbs?: Crumb[];
}

export function PageHero({ eyebrow, title, summary, crumbs }: PageHeroProps) {
  return (
    <div className="page-hero">
      <StarGrid />
      <div className="container page-hero__inner">
        {crumbs ? (
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            {crumbs.map((crumb, index) => (
              <span key={crumb.label}>
                {index > 0 ? " / " : ""}
                {crumb.href ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span className="breadcrumbs__current">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <MagneticText as="h1" className="page-hero__title" text={title} accentLastWord />
        {summary ? <p className="page-hero__summary">{summary}</p> : null}
      </div>
    </div>
  );
}
