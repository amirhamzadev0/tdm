import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { MapPreview } from "@/components/maps/MapPreview";
import { routeSeo } from "@/config/seo";
import { site } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { phoneHref } from "@/utils/format";

export const metadata = buildMetadata({ ...routeSeo.contact, path: "/contact" });

interface Channel {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

export default function ContactPage() {
  const channels: Channel[] = [
    { icon: Phone, label: "Call us", value: site.phone, href: phoneHref(site.phone) },
    { icon: Mail, label: "Email us", value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: "Visit the shop", value: site.address, href: site.mapUrl },
    { icon: Clock, label: "Opening hours", value: site.hours },
  ];

  return (
    <div className="contact-page">
      <header className="contact-intro">
        <p className="contact-intro__eyebrow">Contact us</p>
        <h1 className="contact-intro__title">Talk to the device masters</h1>
        <p className="contact-intro__text">
          Visit the shop, call us, or send a message and we will get back to you.
        </p>
      </header>

      <ul className="contact-channels">
        {channels.map((channel, index) => {
          const Icon = channel.icon;
          const body = (
            <>
              <span className="contact-channel__icon" aria-hidden="true">
                <Icon size={26} />
              </span>
              <span className="contact-channel__label">{channel.label}</span>
              <span className="contact-channel__value">{channel.value}</span>
            </>
          );
          return (
            <li
              key={channel.label}
              className={`contact-channel contact-channel--${(index % 4) + 1}`}
            >
              {channel.href ? (
                <a
                  href={channel.href}
                  className="contact-channel__link"
                  {...(channel.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {body}
                </a>
              ) : (
                <div className="contact-channel__link">{body}</div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="contact-split">
        <section className="contact-map" aria-label="Shop location">
          <h2 className="contact-map__title">Find the shop</h2>
          <MapPreview />
          <ul className="contact-social">
            {site.social.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <ContactForm />
      </div>
    </div>
  );
}
