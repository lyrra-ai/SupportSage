"use client";

import { useEffect, useState } from "react";
import styles from "./PipelineProgress.module.css";

const STAGES = [
  { label: "Checking guardrails", ms: 500 },
  { label: "Classifying query (SIMPLE / COMPLEX / ESCALATE)", ms: 650 },
  { label: "Hybrid search: BM25 + Pinecone + rerank", ms: 900 },
  { label: "Generating grounded response", ms: Infinity },
];

/** Animates through SupportSage's real pipeline stages while a query is in flight. */
export function PipelineProgress() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage >= STAGES.length - 1) return;
    const id = setTimeout(() => setStage((s) => s + 1), STAGES[stage].ms);
    return () => clearTimeout(id);
  }, [stage]);

  return (
    <div className={styles.wrap}>
      {STAGES.map((s, i) => {
        const state = i < stage ? "done" : i === stage ? "active" : "idle";
        return (
          <div key={s.label} className={styles.step} data-state={state}>
            <span className={styles.dot}>
              {state === "done" && <CheckIcon />}
              {state === "active" && <span className={styles.spinner} />}
              {state === "idle" && <span className={styles.dotIdle} />}
            </span>
            <span className={state === "active" ? styles.shimmerText : undefined}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className={styles.dotDone} viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d="M20 6 9 17l-5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
