import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { routeSeo } from "@/config/seo";
import { site } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { phoneHref } from "@/utils/format";

export const metadata = buildMetadata({ ...routeSeo.contact, path: "/contact" });

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="// Contact"
        title="Talk to the device masters"
        summary="Visit the shop, call us, or send a message and we will get back to you."
      />
      <Section>
        <div className="contact-grid">
          <div className="contact-card card">
            <h2 className="contact-card__title">Visit or call</h2>
            <dl className="contact-card__list">
              <dt>Address</dt>
              <dd>{site.address}</dd>
              <dt>Hours</dt>
              <dd>{site.hours}</dd>
              <dt>Phone</dt>
              <dd>
                <a href={phoneHref(site.phone)}>{site.phone}</a>
              </dd>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
              {site.social.map((link) => (
                <div key={link.href} className="contact-card__social">
                  <dt>{link.label}</dt>
                  <dd>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.href.replace(/^https?:\/\/(www\.)?/, "")}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
