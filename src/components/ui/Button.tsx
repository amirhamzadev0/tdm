import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "ghost" | "outline";

interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: "default" | "small";
  block?: boolean;
  className?: string;
}

function buttonClass({
  variant = "primary",
  size = "default",
  block,
  className,
}: ButtonStyleProps) {
  return [
    "btn",
    `btn--${variant}`,
    size === "small" ? "btn--small" : "",
    block ? "btn--block" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

interface ButtonLinkProps extends ButtonStyleProps {
  href: string;
  children: ReactNode;
}

export function ButtonLink({ href, children, ...style }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClass(style)}>
      {children}
    </Link>
  );
}

interface ButtonProps
  extends ButtonStyleProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  children: ReactNode;
}

export function Button({ variant, size, block, className, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClass({ variant, size, block, className })} {...rest} />
  );
}
