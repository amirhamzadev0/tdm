"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import type { Product } from "@/models/product";
import { conditionLabel, discountPercent } from "@/utils/format";
import { PriceTag } from "../ui/PriceTag";

/** Drag distance (px) after which a release counts as a swipe. */
const SWIPE_THRESHOLD = 110;
/** Pointer travel (px) below which a press is a click, not a drag. */
const CLICK_SLOP = 6;
const FLY_MS = 320;
const VISIBLE_CARDS = 3;
/** Transform per stack position: front card, then left-tilted, then right-tilted. */
const BACK_POSES = [
  "translate(0, 0) rotate(0deg) scale(1)",
  "translate(-30px, 12px) rotate(-7deg) scale(0.96)",
  "translate(30px, 22px) rotate(7deg) scale(0.92)",
];
/** After every three regular cards, the next one is amber. */
const AMBER_EVERY = 4;

type Direction = 1 | -1;

/**
 * Tinder-style stack of sale products. The top card follows the pointer; releasing it past the
 * threshold flies it off to the left or right and sends it to the back of the stack. A tap
 * opens the product's detail page.
 */
export function FlashSwipeDeck({ products }: { products: Product[] }) {
  const [order, setOrder] = useState(() => products.map((_, index) => index));
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [leaving, setLeaving] = useState<Direction | null>(null);

  const startX = useRef<number | null>(null);
  const moved = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (products.length === 0) return null;

  const swipe = (direction: Direction) => {
    if (leaving !== null || order.length < 2) return;
    setLeaving(direction);
    timer.current = window.setTimeout(() => {
      // The swiped card goes to the end of the stack.
      setOrder((current) => [...current.slice(1), ...current.slice(0, 1)]);
      setLeaving(null);
      setDragX(0);
      setDragging(false);
    }, FLY_MS);
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (leaving !== null) return;
    startX.current = event.clientX;
    moved.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (startX.current === null) return;
    const delta = event.clientX - startX.current;
    if (Math.abs(delta) > CLICK_SLOP) moved.current = true;
    setDragX(delta);
  };

  const onPointerEnd = (event: PointerEvent<HTMLElement>) => {
    if (startX.current === null) return;
    const delta = event.clientX - startX.current;
    startX.current = null;
    setDragging(false);

    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      swipe(delta > 0 ? 1 : -1);
    } else {
      setDragX(0);
    }
  };

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // A drag ends in a click on the same element; do not navigate for those.
    if (moved.current) {
      event.preventDefault();
      moved.current = false;
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") swipe(-1);
    if (event.key === "ArrowRight") swipe(1);
  };

  return (
    <div className="swipe">
      <div
        className="swipe__deck"
        role="group"
        aria-roledescription="carousel"
        aria-label="Flash sale deals. Swipe a card left or right, or use the arrow keys."
        onKeyDown={onKeyDown}
      >
        {order.slice(0, VISIBLE_CARDS).map((productIndex, rank) => {
          const product = products[productIndex];
          if (!product) return null;
          const percent = discountPercent(product.price, product.oldPrice);
          const isTop = rank === 0;
          const amber = productIndex % AMBER_EVERY === AMBER_EVERY - 1;

          // Back cards fan out: one tilts left, the next tilts right, so both stay visible.
          let transform = BACK_POSES[rank] ?? BACK_POSES[BACK_POSES.length - 1] ?? "";
          let opacity = 1;
          if (isTop && leaving !== null) {
            transform = `translateX(${leaving * 620}px) rotate(${leaving * 28}deg)`;
            opacity = 0;
          } else if (isTop) {
            transform = `translateX(${dragX}px) rotate(${dragX * 0.06}deg)`;
          }

          const body = (
            <>
              <span className="swipe-card__media">
                <span>{product.name}</span>
                <span className="swipe-card__tag">{conditionLabel(product.condition)}</span>
                {percent > 0 ? <span className="swipe-card__discount">-{percent}%</span> : null}
              </span>
              <span className="swipe-card__name">{product.name}</span>
              <span className="swipe-card__spec">{product.spec}</span>
              <PriceTag price={product.price} oldPrice={product.oldPrice} />
              <span className="swipe-card__cta">View details</span>
            </>
          );

          const style = {
            transform,
            opacity,
            zIndex: VISIBLE_CARDS - rank,
            transition:
              isTop && dragging ? "none" : `transform ${FLY_MS}ms ease, opacity ${FLY_MS}ms ease`,
          };

          return isTop ? (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              className={`swipe-card swipe-card--top${amber ? " swipe-card--amber" : ""}`}
              style={style}
              draggable={false}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerEnd}
              onPointerCancel={onPointerEnd}
              onClick={onClick}
            >
              {body}
            </Link>
          ) : (
            <div
              key={product.id}
              className={`swipe-card${amber ? " swipe-card--amber" : ""}`}
              style={style}
              aria-hidden="true"
            >
              {body}
            </div>
          );
        })}
      </div>

      <div className="swipe__controls">
        <button
          type="button"
          className="swipe__button"
          onClick={() => swipe(-1)}
          aria-label="Swipe left"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </button>
        <p className="swipe__hint">Swipe a card left or right. Tap it to see the details.</p>
        <button
          type="button"
          className="swipe__button"
          onClick={() => swipe(1)}
          aria-label="Swipe right"
        >
          <ArrowRight size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
