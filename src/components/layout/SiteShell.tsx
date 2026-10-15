import type { ReactNode } from "react";
import { CartDrawer } from "../cart/CartDrawer";
import { ButtonSpotlight } from "./ButtonSpotlight";
import { Footer } from "./Footer";
import { GridGlow } from "./GridGlow";
import { Header } from "./Header";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <GridGlow />
      <ButtonSpotlight />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
