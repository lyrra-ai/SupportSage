"use client";

import { useSyncExternalStore } from "react";

/** `null` during server render / hydration, when the viewport is unknown. */
export function useMediaQuery(query: string): boolean | null {
  return useSyncExternalStore<boolean | null>(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => null,
  );
}

export type Theme = "light" | "dark";

/** Reads the data-theme attribute set by the pre-paint script in layout.tsx. */
export function useTheme(): Theme | null {
  return useSyncExternalStore(
    (onChange) => {
      const observer = new MutationObserver(onChange);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      return () => observer.disconnect();
    },
    () => (document.documentElement.dataset.theme === "light" ? "light" : "dark"),
    () => null,
  );
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("supportsage.theme", theme);
  } catch {
    /* preference just won't persist */
  }
}
