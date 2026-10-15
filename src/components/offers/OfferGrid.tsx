import type { Offer } from "@/models/offer";
import { CopyCodeButton } from "./CopyCodeButton";

export function OfferGrid({ offers }: { offers: Offer[] }) {
  return (
    <div className="offer-grid">
      {offers.map((offer) => (
        <article key={offer.id} className="offer-card card">
          <div className="offer-card__highlight">{offer.highlight}</div>
          <h3 className="offer-card__title">{offer.title}</h3>
          <p className="offer-card__text">{offer.description}</p>
          <CopyCodeButton code={offer.code} />
        </article>
      ))}
    </div>
  );
}
