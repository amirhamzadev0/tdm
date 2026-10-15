import "server-only";
import { cache } from "react";
import { container } from "@/server/container";

export const getRepairPageViewModel = cache(async () => {
  const [content, services] = await Promise.all([
    container.pages.getRepair(),
    container.repairs.list(),
  ]);
  return { content, services };
});

export const getRepairServicePageViewModel = cache(async (slug: string) => {
  const service = await container.repairs.findBySlug(slug);
  if (!service) return null;

  const [related, services] = await Promise.all([
    container.repairs.listRelated(service, 3),
    container.repairs.list(),
  ]);
  return { service, related, services };
});

export const getRepairServiceSlugs = cache(async () => {
  const services = await container.repairs.list();
  return services.map((service) => service.slug);
});
