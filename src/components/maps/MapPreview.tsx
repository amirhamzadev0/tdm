import { ArrowUpRight } from "lucide-react";
import { site } from "@/config/site";

/**
 * Small embedded map of the shop. The whole map is a link that opens the location in the
 * maps app / Google Maps in a new tab (the same link the footer address uses).
 */
export function MapPreview() {
  return (
    <div className="map-preview">
      <iframe
        className="map-preview__frame"
        src={site.mapEmbedUrl}
        title={`Map showing ${site.address}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        tabIndex={-1}
      />
      <a
        className="map-preview__link"
        href={site.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${site.address} in maps`}
      >
        <span className="map-preview__badge">
          Open in Maps <ArrowUpRight size={14} aria-hidden="true" />
        </span>
      </a>
    </div>
  );
}
