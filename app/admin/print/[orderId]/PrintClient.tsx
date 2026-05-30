"use client";

import { useEffect } from "react";

/** Triggers the browser print dialog as soon as the receipt is mounted. */
export function PrintClient() {
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        window.print();
      } catch {}
    }, 350);
    return () => clearTimeout(t);
  }, []);
  return null;
}
