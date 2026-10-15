"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/** Mobile menu state. The menu closes on Escape and whenever the route changes. */
export function useNavigation() {
  const pathname = usePathname();
  // Remember which pathname the menu was opened on; a different pathname means it is closed.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const isOpen = openedOn === pathname;

  const close = useCallback(() => setOpenedOn(null), []);
  const toggle = useCallback(
    () => setOpenedOn((current) => (current === pathname ? null : pathname)),
    [pathname],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenedOn(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return { isOpen, toggle, close, pathname };
}
