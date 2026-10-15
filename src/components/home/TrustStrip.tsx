import type { Highlight } from "@/models/content";

export function TrustStrip({ items }: { items: Highlight[] }) {
  return (
    <ul className="container trust-strip">
      {items.map((item) => (
        <li key={item.title} className="trust-strip__item">
          <div className="trust-strip__title">{item.title}</div>
          <div className="trust-strip__text">{item.text}</div>
        </li>
      ))}
    </ul>
  );
}
