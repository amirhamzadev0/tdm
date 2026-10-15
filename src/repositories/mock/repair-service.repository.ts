import servicesData from "@/data/mock/services.json";
import type { RepairService } from "@/models/repair-service";
import type { RepairServiceRepository } from "../contracts";

export class MockRepairServiceRepository implements RepairServiceRepository {
  async findAll(): Promise<RepairService[]> {
    return structuredClone(servicesData as RepairService[]).sort((a, b) => a.order - b.order);
  }

  async findBySlug(slug: string): Promise<RepairService | null> {
    const found = (servicesData as RepairService[]).find((service) => service.slug === slug);
    return found ? structuredClone(found) : null;
  }
}
