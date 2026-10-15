import type { Highlight } from "@/models/content";

export function RepairGuarantees({ items }: { items: Highlight[] }) {
  return (
    <ul className="guarantee-grid">
      {items.map((item) => (
        <li key={item.title} className="guarantee card">
          <div className="guarantee__title">{item.title}</div>
          <div className="guarantee__text">{item.text}</div>
        </li>
      ))}
    </ul>
  );
}
