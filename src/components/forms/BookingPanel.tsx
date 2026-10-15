import { site } from "@/config/site";
import { phoneHref } from "@/utils/format";
import { MapPreview } from "../maps/MapPreview";
import { StarGrid } from "../ui/StarGrid";
import { BookingForm } from "./BookingForm";

interface BookingPanelProps {
  heading: string;
  /** Part of `heading` to highlight in amber. */
  headingAccent?: string;
  summary: string;
  serviceTitles: string[];
  defaultService?: string;
}

/** Appointment section: contact details beside the booking form. */
export function BookingPanel({
  heading,
  headingAccent,
  summary,
  serviceTitles,
  defaultService,
}: BookingPanelProps) {
  const accentIndex = headingAccent ? heading.indexOf(headingAccent) : -1;

  return (
    <div className="booking">
      <div className="booking__aside">
        <StarGrid />
        <div>
          <h2 className="booking__title">
            {accentIndex >= 0 && headingAccent ? (
              <>
                {heading.slice(0, accentIndex)}
                <span className="booking__accent">{headingAccent}</span>
                {heading.slice(accentIndex + headingAccent.length)}
              </>
            ) : (
              heading
            )}
          </h2>
          <p className="booking__summary">{summary}</p>
        </div>
        <MapPreview />
        <div className="booking__details">
          {site.hours}
          <br />
          <a href={phoneHref(site.phone)}>{site.phone}</a>
          <br />
          {site.address}
        </div>
      </div>
      <BookingForm serviceTitles={serviceTitles} defaultService={defaultService} />
    </div>
  );
}
