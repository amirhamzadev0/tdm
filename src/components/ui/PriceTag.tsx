import { formatPrice } from "@/utils/format";

interface PriceTagProps {
  price: number;
  oldPrice: number | null;
}

export function PriceTag({ price, oldPrice }: PriceTagProps) {
  return (
    <div className="price-tag">
      <span className="price">{formatPrice(price)}</span>
      {oldPrice && oldPrice > price ? <s className="price-old">{formatPrice(oldPrice)}</s> : null}
    </div>
  );
}
