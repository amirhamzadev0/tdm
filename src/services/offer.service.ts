import type { Offer } from "@/models/offer";
import type { OfferRepository } from "@/repositories/contracts";

export class OfferService {
  constructor(private readonly repository: OfferRepository) {}

  async list(): Promise<Offer[]> {
    return this.repository.findAll();
  }
}
