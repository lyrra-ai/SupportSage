"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "./api";

export type BackendStatus = "checking" | "online" | "unreachable";

/** Pings the API root (cheap, no model load) and re-checks while it's down. */
export function useBackendStatus(): BackendStatus {
  const [status, setStatus] = useState<BackendStatus>("checking");

  useEffect(() => {
    let cancelled = false;
    let retry: ReturnType<typeof setTimeout>;

    const check = async () => {
      try {
        const res = await fetch(`${API_BASE}/`, { signal: AbortSignal.timeout(10_000) });
        if (cancelled) return;
        setStatus(res.ok ? "online" : "unreachable");
        if (!res.ok) retry = setTimeout(check, 15_000);
      } catch {
        if (cancelled) return;
        setStatus("unreachable");
        retry = setTimeout(check, 15_000);
      }
    };

    check();
    return () => {
      cancelled = true;
      clearTimeout(retry);
    };
  }, []);

  return status;
}
