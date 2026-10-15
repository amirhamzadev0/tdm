import Link from "next/link";
import type { Category } from "@/models/category";
import { pad2 } from "@/utils/format";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="category-grid">
      {categories.map((category, index) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          className={`category-card category-card--${(index % 5) + 1}`}
        >
          <div className="category-card__top">
            <span>{pad2(index + 1)}</span>
            <span className="category-card__go">GO</span>
          </div>
          <div>
            <div className="category-card__name">{category.name}</div>
            <div className="category-card__summary">{category.summary}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
