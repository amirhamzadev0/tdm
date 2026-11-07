"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

/** Large product image with arrows and a thumbnail strip when there is more than one picture. */
export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const multiple = count > 1;
  const go = (next: number) => setIndex((next + count) % count);

  return (
    <div className="pdp__media">
      <div className="pdp__stage">
        {count > 0 ? (
          <Image
            key={images[index]}
            src={images[index]}
            alt={name}
            fill
            priority
            sizes="(max-width: 991px) 92vw, 780px"
            className="pdp__image"
          />
        ) : (
          <span className="pdp__noimage">{name}</span>
        )}

        {multiple ? (
          <>
            <button
              type="button"
              className="pdp__arrow pdp__arrow--prev"
              aria-label="Previous image"
              onClick={() => go(index - 1)}
            >
              <ChevronLeft size={26} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="pdp__arrow pdp__arrow--next"
              aria-label="Next image"
              onClick={() => go(index + 1)}
            >
              <ChevronRight size={26} aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      {multiple ? (
        <ul className="pdp__thumbs">
          {images.map((src, thumbIndex) => (
            <li key={src}>
              <button
                type="button"
                className="pdp__thumb"
                aria-label={`Show image ${thumbIndex + 1}`}
                aria-current={thumbIndex === index}
                onClick={() => setIndex(thumbIndex)}
              >
                <Image src={src} alt="" fill sizes="124px" className="pdp__thumb-image" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
