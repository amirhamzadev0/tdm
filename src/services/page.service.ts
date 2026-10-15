import type { HomeContent, RepairContent } from "@/models/content";
import type { PageRepository } from "@/repositories/contracts";

export class PageService {
  constructor(private readonly repository: PageRepository) {}

  async getHome(): Promise<HomeContent> {
    return this.repository.getHome();
  }

  async getRepair(): Promise<RepairContent> {
    return this.repository.getRepair();
  }
}
