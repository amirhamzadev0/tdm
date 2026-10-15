import type { ContentBlock } from "./content";

export interface RepairService {
  id: string;
  slug: string;
  title: string;
  summary: string;
  /** Lucide icon name. */
  icon: string;
  /** Starting price in whole PKR. */
  startingPrice: number;
  body: ContentBlock[];
  order: number;
}
