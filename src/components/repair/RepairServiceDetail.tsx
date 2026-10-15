import type { RepairService } from "@/models/repair-service";
import { formatPrice } from "@/utils/format";
import { RichText } from "../content/RichText";
import { ButtonLink } from "../ui/Button";
import { Icon } from "../ui/Icon";

export function RepairServiceDetail({ service }: { service: RepairService }) {
  return (
    <div className="card repair-detail">
      <div className="repair-detail__header">
        <Icon name={service.icon} size={32} className="service-card__icon" />
        <div>
          <div className="eyebrow">Starting from {formatPrice(service.startingPrice)}</div>
          <p className="repair-detail__summary">{service.summary}</p>
        </div>
      </div>
      <RichText blocks={service.body} />
      <div className="hero__actions">
        <ButtonLink href="/repair#book">Book this repair</ButtonLink>
        <ButtonLink href="/contact" variant="ghost">
          Ask a question
        </ButtonLink>
      </div>
    </div>
  );
}
