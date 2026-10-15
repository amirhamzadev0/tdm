import pagesData from "@/data/mock/pages.json";
import type { HomeContent, RepairContent } from "@/models/content";
import type { PageRepository } from "../contracts";

export class MockPageRepository implements PageRepository {
  async getHome(): Promise<HomeContent> {
    return structuredClone(pagesData.home as HomeContent);
  }

  async getRepair(): Promise<RepairContent> {
    return structuredClone(pagesData.repair as RepairContent);
  }
}
