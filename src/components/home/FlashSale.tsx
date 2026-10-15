import type { Product } from "@/models/product";
import { FlashSwipeDeck } from "./FlashSwipeDeck";
import { SaleClock } from "./SaleClock";

/** Countdown plus a swipeable stack of the discounted devices. */
export function FlashSale({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div className="flash-sale">
      <div className="flash-sale__timer">
        <span className="flash-sale__label">Ends in</span>
        <SaleClock />
      </div>
      <FlashSwipeDeck products={products} />
    </div>
  );
}
