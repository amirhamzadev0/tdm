"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { useNavigation } from "@/hooks/useNavigation";
import type { NavItem } from "@/models/site";

export function MobileMenu({ items }: { items: NavItem[] }) {
  const { isOpen, toggle, close } = useNavigation();

  return (
    <>
      <button
        type="button"
        className="menu-toggle"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
      </button>

      {isOpen ? (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile">
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="mobile-menu__link" onClick={close}>
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Fragment key={child.href}>
                    <Link
                      href={child.href}
                      className="mobile-menu__link mobile-menu__link--child"
                      onClick={close}
                    >
                      {child.label}
                    </Link>
                    {child.children?.map((grand) => (
                      <Link
                        key={grand.href}
                        href={grand.href}
                        className="mobile-menu__link mobile-menu__link--grand"
                        onClick={close}
                      >
                        {grand.label}
                      </Link>
                    ))}
                  </Fragment>
                ))}
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </>
  );
}
