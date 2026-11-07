import { ArrowRight, ShieldCheck, ShoppingBag, Wrench, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { Offering } from "@/models/content";
import { SlideInOnView } from "../ui/SlideInOnView";

/** Icon for each card, in the same order as the content. */
const icons: LucideIcon[] = [ShoppingBag, Wrench, ShieldCheck];

export function OfferingCards({ items }: { items: Offering[] }) {
  return (
    <SlideInOnView as="ul" className="feature-grid">
      {items.map((item, index) => {
        const Icon = icons[index % icons.length];
        return (
          <li key={item.number} className={`feature feature--${(index % 3) + 1}`}>
            <span className="feature__number" aria-hidden="true">
              {item.number}
            </span>
            <span className="feature__icon" aria-hidden="true">
              <Icon size={34} strokeWidth={2} />
            </span>
            <h3 className="feature__title">{item.title}</h3>
            <p className="feature__text">{item.text}</p>
            <Link href={item.cta.href} className="feature__cta">
              {item.cta.label}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </li>
        );
      })}
    </SlideInOnView>
  );
}
