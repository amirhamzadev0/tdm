import { Check } from "lucide-react";
import Link from "next/link";
import { repairGuide } from "@/config/repairGuide";
import type { Highlight } from "@/models/content";
import type { RepairService } from "@/models/repair-service";
import { formatPrice } from "@/utils/format";

interface RepairGuideProps {
  services: RepairService[];
  promises: Highlight[];
  /** Hide the guide's own heading block when the page already has a title. */
  hideHead?: boolean;
}

/** Short article explaining what we repair and how a repair works, step by step. */
export function RepairGuide({ services, promises, hideHead }: RepairGuideProps) {
  return (
    <section className="guide" id="repair-guide" aria-label={repairGuide.title}>
      <article className="guide__card">
        {hideHead ? null : (
          <header className="guide__head">
            <p className="guide__eyebrow">{repairGuide.eyebrow}</p>
            <h2 className="guide__title">{repairGuide.title}</h2>
            <p className="guide__lead">{repairGuide.lead}</p>
          </header>
        )}

        <div className="guide__body" data-headless={hideHead ? "true" : undefined}>
          <ol className="guide__steps">
            {repairGuide.steps.map((step) => (
              <li key={step.number} className="guide__step">
                <span className="guide__number" aria-hidden="true">
                  {step.number}
                </span>
                <div>
                  <h3 className="guide__step-title">{step.title}</h3>
                  <p className="guide__step-text">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <aside className="guide__side">
            <section>
              <h3 className="guide__side-title">{repairGuide.servicesTitle}</h3>
              <ul className="guide__services">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link href={`/repair/${service.slug}`}>
                      <span>{service.title}</span>
                      <small>from {formatPrice(service.startingPrice)}</small>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="guide__side-title">{repairGuide.promiseTitle}</h3>
              <ul className="guide__promises">
                {promises.map((promise) => (
                  <li key={promise.title}>
                    <Check size={18} aria-hidden="true" />
                    <span>
                      <b>{promise.title}</b> {promise.text}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </article>
    </section>
  );
}
