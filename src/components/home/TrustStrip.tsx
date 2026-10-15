import type { Highlight } from "@/models/content";
import { ScatterOnScroll } from "../ui/ScatterOnScroll";

export function TrustStrip({ items }: { items: Highlight[] }) {
  return (
    <ScatterOnScroll as="ul" className="container trust-strip">
      {items.map((item) => (
        <li key={item.title} className="trust-strip__item" data-scatter>
          <div className="trust-strip__title">{item.title}</div>
          <div className="trust-strip__text">{item.text}</div>
        </li>
      ))}
    </ScatterOnScroll>
  );
}
