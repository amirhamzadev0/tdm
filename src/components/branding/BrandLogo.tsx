import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";

export function BrandLogo() {
  return (
    <Link href="/" className="brand-logo" aria-label={`${site.name} home`}>
      <Image src="/branding/logo.png" alt="" width={36} height={36} className="brand-logo__image" />
      {site.name}
    </Link>
  );
}
