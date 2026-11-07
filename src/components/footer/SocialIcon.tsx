import { ExternalLink } from "lucide-react";

/** Brand logos in their own colours (the icon library has no brand icons). */
export function SocialIcon({ label }: { label: string }) {
  switch (label.toLowerCase()) {
    case "instagram":
      return (
        <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
          <defs>
            <radialGradient id="ig-grad" cx="0.3" cy="1.05" r="1.15">
              <stop offset="0" stopColor="#ffd776" />
              <stop offset="0.25" stopColor="#f9a03f" />
              <stop offset="0.5" stopColor="#e1306c" />
              <stop offset="0.8" stopColor="#a02fc4" />
              <stop offset="1" stopColor="#4f5bd5" />
            </radialGradient>
          </defs>
          <rect width="32" height="32" rx="9" fill="url(#ig-grad)" />
          <rect
            x="7.5"
            y="7.5"
            width="17"
            height="17"
            rx="5"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
          />
          <circle cx="16" cy="16" r="4.2" fill="none" stroke="#fff" strokeWidth="2" />
          <circle cx="21.2" cy="10.8" r="1.2" fill="#fff" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="#1877f2" />
          <path
            d="M17.9 26v-8.7h2.9l.5-3.4h-3.4v-2.2c0-1 .4-1.8 1.9-1.8h1.6V6.9c-.3 0-1.3-.2-2.5-.2-2.6 0-4.3 1.6-4.3 4.4v2.8h-2.9v3.4h2.9V26h3.3Z"
            fill="#fff"
          />
        </svg>
      );
    default:
      return <ExternalLink size={18} aria-hidden="true" />;
  }
}
