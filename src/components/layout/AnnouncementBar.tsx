import Link from "next/link";
import { announcementLinks } from "@/config/navigation";

export function AnnouncementBar() {
  return (
    <nav className="announce" aria-label="Quick links">
      <ul className="announce__list">
        {announcementLinks.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className={`announce__link${link.tone ? ` announce__link--${link.tone}` : ""}`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
