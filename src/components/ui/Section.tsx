import type { ReactNode } from "react";
import { StarGrid } from "./StarGrid";

interface SectionProps {
  id?: string;
  /** "navy" renders a full-width dark band with curved edges. */
  tone?: "navy";
  children: ReactNode;
}

export function Section({ id, tone, children }: SectionProps) {
  return (
    <section id={id} className={`section${tone ? ` section--${tone}` : ""}`}>
      {tone ? <StarGrid /> : null}
      <div className="container">{children}</div>
    </section>
  );
}
