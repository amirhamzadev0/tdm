import { CheckoutForm } from "@/components/forms/CheckoutForm";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { routeSeo } from "@/config/seo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ ...routeSeo.checkout, path: "/checkout", noIndex: true });

export default function CheckoutPage() {
  return (
    <>
      <PageHero eyebrow="// Checkout" title="Checkout" />
      <Section>
        <CheckoutForm />
      </Section>
    </>
  );
}
