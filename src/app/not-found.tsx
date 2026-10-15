import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { MagneticText } from "@/components/ui/MagneticText";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="container not-found">
      <div className="not-found__code">404</div>
      <MagneticText
        as="h1"
        className="page-hero__title"
        text="This page is offline."
        accentLastWord
      />
      <p className="page-hero__summary">
        The page you are looking for does not exist or has moved. Try the shop or book a repair.
      </p>
      <div className="hero__actions">
        <ButtonLink href="/shop">Shop devices</ButtonLink>
        <ButtonLink href="/" variant="ghost">
          Back home
        </ButtonLink>
      </div>
    </div>
  );
}
