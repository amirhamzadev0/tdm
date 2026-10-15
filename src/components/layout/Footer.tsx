import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { footerNavigation, mainNavigation } from "@/config/navigation";
import { site } from "@/config/site";
import { phoneHref } from "@/utils/format";
import { FooterEffects } from "../footer/FooterEffects";
import { ScrollToTop } from "../footer/ScrollToTop";
import { SocialIcon } from "../footer/SocialIcon";
import { StarGrid } from "../ui/StarGrid";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const shopLinks = mainNavigation.find((item) => item.href === "/shop")?.children ?? [];

export function Footer() {
  return (
    <footer className="site-footer">
      <StarGrid />
      <FooterEffects />
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <div className="site-footer__wordmark" aria-hidden="true">
            {Array.from(site.fullName).map((letter, index) => (
              <span key={index} className="site-footer__letter">
                {letter === " " ? " " : letter}
              </span>
            ))}
          </div>
          <Link href="/" className="site-footer__logo" aria-label={`${site.fullName} home`}>
            <Image src="/branding/logo.png" alt="" width={120} height={120} />
            <span className="orbit orbit--outer" aria-hidden="true">
              <span className="orbit__ball orbit__ball--yellow" />
            </span>
            <span className="orbit orbit--inner" aria-hidden="true">
              <span className="orbit__ball orbit__ball--blue" />
            </span>
          </Link>
        </div>

        <div className="site-footer__columns">
          <div className="site-footer__column">
            <h2 className="site-footer__heading">Explore</h2>
            <ul className="site-footer__list">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="site-footer__link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__column">
            <h2 className="site-footer__heading">Shop</h2>
            <ul className="site-footer__list">
              {shopLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="site-footer__link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className="site-footer__heading site-footer__heading--spaced">Follow</h2>
            <ul className="site-footer__socials">
              {site.social.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="site-footer__social"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <SocialIcon label={link.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__column">
            <h2 className="site-footer__heading">Visit us</h2>
            <ul className="site-footer__contact">
              <li>
                <MapPin size={16} aria-hidden="true" />
                <a
                  href={site.mapUrl}
                  className="site-footer__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {site.address}
                </a>
              </li>
              <li>
                <Clock size={16} aria-hidden="true" />
                <span>{site.hours}</span>
              </li>
              <li>
                <Phone size={16} aria-hidden="true" />
                <a href={phoneHref(site.phone)} className="site-footer__link">
                  {site.phone}
                </a>
              </li>
              <li>
                <Mail size={16} aria-hidden="true" />
                <a href={`mailto:${site.email}`} className="site-footer__link">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>
            © <CurrentYear /> {site.fullName}. All rights reserved.
          </span>
          <span className="site-footer__tagline">{site.tagline}</span>
          <ScrollToTop />
        </div>
      </div>
    </footer>
  );
}
