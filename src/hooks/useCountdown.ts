"use client";

import { useEffect, useState } from "react";
import { pad2 } from "@/utils/format";

/** Looping countdown. Starts from a fixed value so server and client markup match. */
export function useCountdown(startSeconds: number) {
  const [left, setLeft] = useState(startSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setLeft((current) => (current > 0 ? current - 1 : startSeconds));
    }, 1000);
    return () => clearInterval(timer);
  }, [startSeconds]);

  return {
    hours: pad2(Math.floor(left / 3600)),
    minutes: pad2(Math.floor((left % 3600) / 60)),
    seconds: pad2(left % 60),
  };
}
