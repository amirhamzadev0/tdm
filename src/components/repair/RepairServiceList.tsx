import type { RepairService } from "@/models/repair-service";
import { RepairServiceCard } from "./RepairServiceCard";

export function RepairServiceList({ services }: { services: RepairService[] }) {
  return (
    <div className="service-grid">
      {services.map((service, index) => (
        <RepairServiceCard key={service.id} service={service} index={index} />
      ))}
    </div>
  );
}
