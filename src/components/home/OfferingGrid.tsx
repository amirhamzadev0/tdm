import type { Offering } from "@/models/content";
import { ButtonLink } from "../ui/Button";

export function OfferingGrid({ items }: { items: Offering[] }) {
  return (
    <div className="offering-grid">
      {items.map((item) => (
        <div key={item.number} className="offering">
          <div className="offering__number">{item.number}</div>
          <h3 className="offering__title">{item.title}</h3>
          <p className="offering__text">{item.text}</p>
          <ButtonLink href={item.cta.href} size="small">
            {item.cta.label}
          </ButtonLink>
        </div>
      ))}
    </div>
  );
}
