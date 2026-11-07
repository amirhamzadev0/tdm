import { getImageProps } from "next/image";

interface BannerPictureProps {
  src: string;
  mobileSrc: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

/** Landscape banner on tablets and desktops, portrait banner on phones. Fills its parent. */
export function BannerPicture({
  src,
  mobileSrc,
  alt,
  priority = false,
  className,
}: BannerPictureProps) {
  const common = { alt, sizes: "100vw", fill: true, priority };
  const {
    props: { srcSet: desktop, ...rest },
  } = getImageProps({ ...common, src });
  const {
    props: { srcSet: mobile },
  } = getImageProps({ ...common, src: mobileSrc });

  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobile} />
      <source media="(min-width: 768px)" srcSet={desktop} />
      <img {...rest} className={className} alt={alt} />
    </picture>
  );
}
