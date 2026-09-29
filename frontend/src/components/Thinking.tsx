"use client";

import { useEffect, useState } from "react";
import { Orb } from "@aicss/react/orbs";
import { PENDING_STAGES } from "@/lib/trace";
import styles from "./Thinking.module.css";

export function Thinking({
  pending,
  trace,
  elapsedS,
}: {
  pending: boolean;
  trace?: string[];
  elapsedS?: number;
}) {
  const [revealed, setRevealed] = useState(1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!pending || revealed >= PENDING_STAGES.length) return;
    const id = setTimeout(() => setRevealed((n) => n + 1), PENDING_STAGES[revealed - 1].ms);
    return () => clearTimeout(id);
  }, [pending, revealed]);

  const expanded = pending || open;
  const lines = pending ? PENDING_STAGES.slice(0, revealed).map((s) => s.text) : (trace ?? []);

  return (
    <div className={styles.tr}>
      <button
        type="button"
        className={`${styles.header} ${pending ? "" : styles.clickable}`}
        aria-expanded={expanded}
        onClick={pending ? undefined : () => setOpen((o) => !o)}
      >
        {pending ? (
          <span className={styles.orb}>
            <Orb
              key={revealed}
              variant={PENDING_STAGES[revealed - 1].orb}
              label={PENDING_STAGES[revealed - 1].label}
              pill
            />
          </span>
        ) : (
          <>
            <span className={styles.label}>
              <span className={styles.verb}>Thought</span> for {Math.max(1, elapsedS ?? 1)}s
            </span>
            <svg className={styles.chevron} viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
              <path
                d="m4.5 15.75 7.5-7.5 7.5 7.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )}
      </button>

      <div className={`${styles.collapsible} ${expanded ? "" : styles.collapsed}`}>
        <div className={styles.inner}>
          <div className={styles.stream}>
            {lines.map((line, i) => {
              const active = pending && i === lines.length - 1;
              return (
                <p key={`${pending}-${i}`} className={styles.sentence} data-done={!active}>
                  {active ? <span className={styles.dot} /> : <CheckIcon />}
                  <span className={active ? styles.shimmer : undefined}>{line}</span>
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className={styles.mark} viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d="M20 6 9 17l-5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
