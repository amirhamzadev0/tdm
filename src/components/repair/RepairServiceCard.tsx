import Link from "next/link";
import type { RepairService } from "@/models/repair-service";
import { formatPrice, pad2 } from "@/utils/format";
import { Icon } from "../ui/Icon";

interface RepairServiceCardProps {
  service: RepairService;
  index: number;
}

export function RepairServiceCard({ service, index }: RepairServiceCardProps) {
  return (
    <Link href={`/repair/${service.slug}`} className="service-card card card--interactive">
      <div className="service-card__meta">
        <span>{pad2(index + 1)}</span>
        <span>from {formatPrice(service.startingPrice)}</span>
      </div>
      <Icon name={service.icon} className="service-card__icon" />
      <h3 className="service-card__title">{service.title}</h3>
      <p className="service-card__text">{service.summary}</p>
    </Link>
  );
}
