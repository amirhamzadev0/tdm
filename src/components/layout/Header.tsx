import { mainNavigation } from "@/config/navigation";
import { BrandLogo } from "../branding/BrandLogo";
import { CartButton } from "../cart/CartButton";
import { ButtonLink } from "../ui/Button";
import { StarGrid } from "../ui/StarGrid";
import { MobileMenu } from "./MobileMenu";
import { NavigationLinks } from "./NavigationLinks";

export function Header() {
  return (
    <header className="site-header">
      <StarGrid />
      <div className="site-header__bar">
        <BrandLogo />
        <NavigationLinks items={mainNavigation} />
        <div className="header-actions">
          <CartButton />
          <ButtonLink href="/repair#book" size="small">
            Book repair
          </ButtonLink>
          <MobileMenu items={mainNavigation} />
        </div>
      </div>
    </header>
  );
}
