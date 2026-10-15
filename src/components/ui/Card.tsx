import type { ElementType, ReactNode } from "react";

interface CardProps {
  as?: ElementType;
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}

export function Card({ as: Tag = "div", interactive, className, children }: CardProps) {
  const classes = ["card", interactive ? "card--interactive" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
  return <Tag className={classes}>{children}</Tag>;
}
