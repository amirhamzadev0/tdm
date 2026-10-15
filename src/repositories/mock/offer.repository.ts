import offersData from "@/data/mock/offers.json";
import type { Offer } from "@/models/offer";
import type { OfferRepository } from "../contracts";

export class MockOfferRepository implements OfferRepository {
  async findAll(): Promise<Offer[]> {
    return structuredClone(offersData as Offer[]).sort((a, b) => a.order - b.order);
  }
}
