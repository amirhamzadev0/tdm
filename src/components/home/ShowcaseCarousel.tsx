"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import { flushSync } from "react-dom";

export interface CarouselHandle {
  next: () => void;
  prev: () => void;
}

interface ShowcaseCarouselProps {
  items: { id: string; node: ReactNode }[];
  label: string;
  /** "rail" shows product cards four at a time. */
  variant?: "category" | "rail";
  showDots?: boolean;
  autoplayMs?: number;
  /** Lets the parent drive the carousel with its own arrow buttons. */
  controlRef?: Ref<CarouselHandle>;
  /** Reports whether there are more cards than fit on screen (so arrows make sense). */
  onScrollableChange?: (scrollable: boolean) => void;
}

const SLIDE_MS = 700;
const AUTOPLAY_MS = 3800;
const SWIPE_PX = 40;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Endless carousel. The track always renders every card in the current `order`; moving forward
 * slides the track one card left and then moves the first card to the end, moving back does the
 * reverse. How many cards are visible at once comes from the --vis CSS variable.
 */
export function ShowcaseCarousel({
  items,
  label,
  variant = "category",
  showDots = true,
  autoplayMs = AUTOPLAY_MS,
  controlRef,
  onScrollableChange,
}: ShowcaseCarouselProps) {
  const ids = items.map((item) => item.id);
  const [order, setOrder] = useState(ids);
  const [paused, setPaused] = useState(false);
  const [scrollable, setScrollable] = useState(true);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const busy = useRef(false);
  const pendingPrev = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const touchX = useRef<number | null>(null);

  const itemById = new Map(items.map((item) => [item.id, item.node]));

  const finish = useCallback(() => {
    busy.current = false;
  }, []);

  // With no more cards than fit on screen there is nothing to slide to.
  useLayoutEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const measure = () => {
      const visible = parseInt(getComputedStyle(element).getPropertyValue("--vis"), 10) || 1;
      const can = items.length > visible;
      setScrollable(can);
      onScrollableChange?.(can);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items.length, onScrollableChange]);

  const next = useCallback(() => {
    const track = trackRef.current;
    if (!track || busy.current || !scrollable) return;
    busy.current = true;

    const rotate = () => {
      flushSync(() => setOrder((current) => [...current.slice(1), current[0]]));
      track.style.transition = "none";
      track.style.transform = "";
      finish();
    };

    if (prefersReducedMotion()) {
      rotate();
      return;
    }

    track.style.transition = `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    track.style.transform = "translateX(calc(-100% / var(--vis)))";
    // A fixed timer instead of waiting for "transitionend", which can be missed and would
    // leave the carousel stuck.
    timer.current = window.setTimeout(rotate, SLIDE_MS + 30);
  }, [finish, scrollable]);

  const prev = useCallback(() => {
    if (busy.current || !scrollable) return;
    busy.current = true;
    pendingPrev.current = true;
    setOrder((current) => [current[current.length - 1], ...current.slice(0, -1)]);
  }, [scrollable]);

  // After a backward step the last card is first; start one card to the left and slide in.
  useLayoutEffect(() => {
    if (!pendingPrev.current) return;
    pendingPrev.current = false;
    const track = trackRef.current;
    if (!track) return;

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    track.style.transition = "none";
    track.style.transform = "translateX(calc(-100% / var(--vis)))";
    void track.offsetWidth;

    track.style.transition = `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    track.style.transform = "";
    timer.current = window.setTimeout(finish, SLIDE_MS + 30);
  }, [order, finish]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useImperativeHandle(controlRef, () => ({ next, prev }), [next, prev]);

  useEffect(() => {
    if (paused || !scrollable || prefersReducedMotion()) return;
    const interval = window.setInterval(() => {
      if (!document.hidden) next();
    }, autoplayMs);
    return () => window.clearInterval(interval);
  }, [paused, next, autoplayMs, scrollable]);

  const jumpTo = (id: string) => {
    if (busy.current) return;
    setOrder((current) => {
      const index = current.indexOf(id);
      return [...current.slice(index), ...current.slice(0, index)];
    });
  };

  const current = order[0];

  return (
    <div
      ref={viewportRef}
      className="showcase__viewport"
      data-variant={variant}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={(event) => event.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(event) => {
        touchX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchX.current;
        touchX.current = null;
        const end = event.changedTouches[0]?.clientX;
        if (start === null || end === undefined) return;
        if (start - end > SWIPE_PX) next();
        else if (end - start > SWIPE_PX) prev();
      }}
    >
      <ul ref={trackRef} className="showcase__track">
        {order.map((id) => (
          <li key={id} className="showcase__item">
            {itemById.get(id)}
          </li>
        ))}
      </ul>

      {showDots ? (
        <div className="showcase__dots">
          {ids.map((id, index) => (
            <button
              key={id}
              type="button"
              className="showcase__dot"
              data-active={id === current}
              aria-label={`Show ${id}, slide ${index + 1} of ${ids.length}`}
              aria-current={id === current}
              onClick={() => jumpTo(id)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
