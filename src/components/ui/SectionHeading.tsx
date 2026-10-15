import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  summary?: string;
  action?: ReactNode;
  as?: "h1" | "h2";
}

/** Centered heading with the amber highlighter underline. */
export function SectionHeading({ title, summary, action, as: Tag = "h2" }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <Tag className="section-heading__title">{title}</Tag>
      {summary ? <p className="section-heading__summary">{summary}</p> : null}
      {action}
    </div>
  );
}
