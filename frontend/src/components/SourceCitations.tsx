"use client";

import { useState } from "react";
import type { Source } from "@/lib/types";
import styles from "./SourceCitations.module.css";

export function SourceCitations({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false);

  if (sources.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>
          {sources.length} source{sources.length > 1 ? "s" : ""} from knowledge base
        </span>
        <svg
          className={styles.chevron}
          data-open={open}
          viewBox="0 0 24 24"
          width="12"
          height="12"
          aria-hidden="true"
        >
          <path
            d="m4.5 8.25 7.5 7.5 7.5-7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className={styles.list}>
          {sources.map((s, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.itemTop}>
                <span className={styles.tag}>{s.category}</span>
                <span className={styles.tag}>{s.intent}</span>
              </div>
              <div className={styles.question}>&ldquo;{s.original_question}&rdquo;</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
