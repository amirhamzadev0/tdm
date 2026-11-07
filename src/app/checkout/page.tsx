import { CheckoutForm } from "@/components/forms/CheckoutForm";
import { routeSeo } from "@/config/seo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ ...routeSeo.checkout, path: "/checkout", noIndex: true });

export default function CheckoutPage() {
  return (
    <div className="co-page">
      <h1 className="visually-hidden">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
