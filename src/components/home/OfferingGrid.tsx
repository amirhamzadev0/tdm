import type { Offering } from "@/models/content";
import { ButtonLink } from "../ui/Button";
import { ScatterOnScroll } from "../ui/ScatterOnScroll";

export function OfferingGrid({ items }: { items: Offering[] }) {
  return (
    <ScatterOnScroll className="offering-grid">
      {items.map((item) => (
        <div key={item.number} className="offering" data-scatter>
          <div className="offering__number">{item.number}</div>
          <h3 className="offering__title">{item.title}</h3>
          <p className="offering__text">{item.text}</p>
          <ButtonLink href={item.cta.href} size="small">
            {item.cta.label}
          </ButtonLink>
        </div>
      ))}
    </ScatterOnScroll>
  );
}
