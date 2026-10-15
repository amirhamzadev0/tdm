import type { RepairService } from "@/models/repair-service";
import type { RepairServiceRepository } from "@/repositories/contracts";

/** Business logic for the repair catalogue (the model type is `RepairService`). */
export class RepairCatalogService {
  constructor(private readonly repository: RepairServiceRepository) {}

  async list(): Promise<RepairService[]> {
    return this.repository.findAll();
  }

  async findBySlug(slug: string): Promise<RepairService | null> {
    return this.repository.findBySlug(slug);
  }

  async listRelated(service: RepairService, limit = 3): Promise<RepairService[]> {
    const all = await this.repository.findAll();
    return all.filter((candidate) => candidate.id !== service.id).slice(0, limit);
  }
}
