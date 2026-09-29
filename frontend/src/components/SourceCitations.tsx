"use client";

import { useState } from "react";
import type { Source } from "@/lib/types";
import styles from "./SourceCitations.module.css";

export function SourceCitations({ sources }: { sources: Source[] }) {
  const [active, setActive] = useState<number | null>(null);

  if (sources.length === 0) return null;
  const selected = active !== null ? sources[active] : null;

  return (
    <div className={styles.wrap}>
      <div className={styles.chips}>
        <span className={styles.label}>Sources</span>
        {sources.map((s, i) => (
          <button
            key={i}
            type="button"
            className={styles.chip}
            aria-pressed={active === i}
            onClick={() => setActive(active === i ? null : i)}
          >
            <span className={styles.num}>{i + 1}</span>
            <span className={styles.chipText}>{s.original_question.trim()}</span>
          </button>
        ))}
      </div>
      {selected && (
        <div key={active} className={styles.detail}>
          <div className={styles.detailMeta}>
            {selected.category} · {selected.intent}
          </div>
          <div className={styles.detailQuote}>&ldquo;{selected.original_question.trim()}&rdquo;</div>
        </div>
      )}
    </div>
  );
}
