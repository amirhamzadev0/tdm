"use client";

import {
  Cpu,
  Headphones,
  Laptop,
  Monitor,
  Package,
  Phone,
  Search,
  ShoppingBasket,
  Smartphone,
  Tag,
  Watch,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import type { NavItem } from "@/models/site";
import type { HeaderNavItem } from "@/viewmodels/navigation.viewmodel";
import { BrandLogo } from "../branding/BrandLogo";
import { CartButton } from "../cart/CartButton";
import { MobileMenu } from "./MobileMenu";

const icons: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  cpu: Cpu,
  laptop: Laptop,
  monitor: Monitor,
  headphones: Headphones,
  watch: Watch,
  wrench: Wrench,
  tag: Tag,
  phone: Phone,
  package: Package,
};

function isActive(pathname: string, href: string) {
  const path = href.split("#")[0];
  return pathname === path || pathname.startsWith(`${path}/`);
}

/**
 * Floating glass header that sits over the top of the page. Icons reveal their name on hover
 * and categories open a panel with brand shortcuts underneath the bar.
 */
export function HeaderBar({
  items,
  contact,
  mobileItems,
}: {
  items: HeaderNavItem[];
  contact: HeaderNavItem;
  mobileItems: NavItem[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Which section of the open category is pointed at; null shows the default (devices).
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const ContactIcon = icons[contact.icon] ?? Package;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openItem = openIndex === null ? undefined : items[openIndex];

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const term = query.trim();
    router.push(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");
    setSearching(false);
    setQuery("");
  };

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div
        className="hbar"
        onPointerLeave={() => setOpenIndex(null)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpenIndex(null);
            setSearching(false);
          }
        }}
      >
        <div className="hbar__bar" data-search={searching}>
          <div className="hbar__left">
            <BrandLogo />
          </div>

          {searching ? (
            <form className="hbar__search" onSubmit={onSearch} role="search">
              <Search size={18} aria-hidden="true" />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search devices or parts"
                aria-label="Search devices"
              />
            </form>
          ) : (
            <nav className="hnav" aria-label="Main">
              <ul className="hnav__list">
                {items.map((item, index) => {
                  const Icon = icons[item.icon] ?? Package;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="hnav__link"
                        data-open={openIndex === index}
                        aria-current={isActive(pathname, item.href) ? "page" : undefined}
                        aria-label={item.label}
                        onPointerEnter={() => {
                          setOpenIndex(index);
                          setActiveSection(null);
                        }}
                        onFocus={() => {
                          setOpenIndex(index);
                          setActiveSection(null);
                        }}
                      >
                        <Icon size={24} aria-hidden="true" />
                        <span className="hnav__label">
                          <span>{item.label}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          <div className="header-actions">
            <Link
              href={contact.href}
              className="hnav__link hbar__contact"
              aria-label={contact.label}
              aria-current={isActive(pathname, contact.href) ? "page" : undefined}
              onPointerEnter={() => setOpenIndex(null)}
            >
              <ContactIcon size={24} aria-hidden="true" />
              <span className="hnav__label">
                <span>{contact.label}</span>
              </span>
            </Link>
            <Link href="/shop" className="hbar__shop">
              <ShoppingBasket size={22} aria-hidden="true" />
              <span>Shop All</span>
            </Link>
            <button
              type="button"
              className="hbar__icon"
              aria-label={searching ? "Close search" : "Search"}
              onClick={() => setSearching((value) => !value)}
            >
              {searching ? (
                <X size={20} aria-hidden="true" />
              ) : (
                <Search size={20} aria-hidden="true" />
              )}
            </button>
            <CartButton />
            <MobileMenu items={mobileItems} />
          </div>
        </div>

        {openItem?.panel ? (
          <div className="hmega" key={openItem.href}>
            <div className="hmega__side">
              <Link
                href={openItem.href}
                className="hmega__title"
                onClick={() => setOpenIndex(null)}
              >
                <strong>{openItem.label}</strong>
                <span>{openItem.panel.summary}</span>
              </Link>
              {openItem.panel.subcategories.length > 0 ? (
                <ul className="hmega__subs">
                  {openItem.panel.subcategories.map((section, sectionIndex) => (
                    <li key={section.href}>
                      <Link
                        href={section.href}
                        className="hmega__sub"
                        data-active={sectionIndex === (activeSection ?? 0)}
                        onPointerEnter={() => setActiveSection(sectionIndex)}
                        onFocus={() => setActiveSection(sectionIndex)}
                        onClick={() => setOpenIndex(null)}
                      >
                        {section.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <ul className="hmega__products">
              {(activeSection === null
                ? openItem.panel.products
                : (openItem.panel.subcategories[activeSection]?.products ?? openItem.panel.products)
              ).map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/shop/${product.slug}`}
                    className="hmega__product"
                    onClick={() => setOpenIndex(null)}
                  >
                    <span className="hmega__media" aria-hidden="true">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="190px"
                          className="hmega__image"
                        />
                      ) : null}
                    </span>
                    <span className="hmega__name">{product.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </header>
  );
}
