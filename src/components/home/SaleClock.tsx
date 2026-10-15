"use client";

import { flashSaleSeconds } from "@/config/commerce";
import { useCountdown } from "@/hooks/useCountdown";

export function SaleClock() {
  const { hours, minutes, seconds } = useCountdown(flashSaleSeconds);

  return (
    <div className="flash-clock" role="timer" aria-label="Flash sale time remaining">
      <span className="flash-clock__digit">{hours}</span>
      <span className="flash-clock__digit">{minutes}</span>
      <span className="flash-clock__digit flash-clock__digit--seconds">{seconds}</span>
    </div>
  );
}
