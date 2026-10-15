"use client";

import { useState } from "react";

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be blocked; the code stays visible on the button.
    }
  };

  return (
    <button type="button" className="offer-card__code" onClick={copy}>
      {code} · {copied ? "copied" : "copy"}
    </button>
  );
}
