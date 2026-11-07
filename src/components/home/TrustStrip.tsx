import type { Highlight } from "@/models/content";
import { trustIcons } from "./TrustIcons";

export function TrustStrip({ items }: { items: Highlight[] }) {
  return (
    <section className="trust-strip" aria-label="Why choose us">
      <div className="trust-strip__bar">
        <h2 className="trust-strip__heading">Trusted Quality, Delivered</h2>
        <ul className="trust-strip__list">
          {items.map((item, index) => (
            <li key={item.title} className="trust-strip__item">
              <span
                className={`trust-strip__icon trust-strip__icon--${index % trustIcons.length}`}
                aria-hidden="true"
              >
                {trustIcons[index % trustIcons.length]}
              </span>
              <span className="trust-strip__copy">
                <strong className="trust-strip__title">{item.title}</strong>
                <span className="trust-strip__text">{item.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
