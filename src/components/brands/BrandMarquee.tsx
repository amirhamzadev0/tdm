interface BrandMarqueeProps {
  brands: string[];
  title?: string;
}

/** Continuously scrolling line of brand names. Pauses on hover. */
export function BrandMarquee({
  brands,
  title = "We work with only the most trusted brands",
}: BrandMarqueeProps) {
  if (brands.length === 0) return null;

  // Repeat the list so a single group is always wider than the viewport.
  const group = [...brands, ...brands, ...brands];

  return (
    <section className="brand-strip" aria-label={title}>
      <h2 className="brand-strip__title">{title}</h2>
      <div className="brand-strip__viewport">
        <div className="brand-strip__track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="brand-strip__group" aria-hidden={copy === 1 || undefined}>
              {group.map((brand, index) => (
                <li key={`${copy}-${index}`} className="brand-strip__item">
                  {brand}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
