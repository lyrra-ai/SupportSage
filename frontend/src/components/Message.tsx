"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { ChatMessage, Route } from "@/lib/types";
import { buildTrace } from "@/lib/trace";
import { Thinking } from "./Thinking";
import { RouteBadge } from "./RouteBadge";
import { SourceCitations } from "./SourceCitations";
import { GuardrailAlert } from "./GuardrailAlert";
import styles from "./Message.module.css";

export function Message({ message, onRetry }: { message: ChatMessage; onRetry: () => void }) {
  if (message.role === "user") {
    return (
      <div className={styles.userRow}>
        <div className={styles.userBubble}>{message.text}</div>
      </div>
    );
  }

  const { response, pending, error, latencyMs } = message;
  const elapsedS = latencyMs !== undefined ? Math.round(latencyMs / 1000) : undefined;

  return (
    <div className={styles.assistant}>
      {(pending || response) && (
        <Thinking pending={!!pending} trace={response && buildTrace(response)} elapsedS={elapsedS} />
      )}

      {error && (
        <div className={styles.error}>
          <span>{error}</span>
          <button type="button" className={styles.retry} onClick={onRetry}>
            Retry
          </button>
        </div>
      )}

      {response && (
        <>
          <Answer text={response.answer} animate={!!message.fresh} />
          <GuardrailAlert response={response} />
          <SourceCitations sources={response.sources} />
          <Actions text={response.answer} latencyMs={latencyMs} route={response.route} />
        </>
      )}
    </div>
  );
}

function Answer({ text, animate }: { text: string; animate: boolean }) {
  const [shown, setShown] = useState(() =>
    animate && !prefersReducedMotion() ? 0 : text.length,
  );

  useEffect(() => {
    if (shown >= text.length) return;
    const id = setTimeout(() => setShown((n) => Math.min(n + 4, text.length)), 12);
    return () => clearTimeout(id);
  }, [shown, text.length]);

  const streaming = shown < text.length;
  return (
    <div className={styles.prose} data-streaming={streaming}>
      <ReactMarkdown>{text.slice(0, shown)}</ReactMarkdown>
    </div>
  );
}

function Actions({
  text,
  latencyMs,
  route,
}: {
  text: string;
  latencyMs?: number;
  route: Route;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard blocked — nothing useful to show */
    }
  };

  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={styles.iconBtn}
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy answer"}
        title={copied ? "Copied" : "Copy"}
      >
        {copied ? (
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <rect x="8" y="8" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
            <path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8" fill="none" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        )}
      </button>
      <RouteBadge route={route} />
      {latencyMs !== undefined && (
        <span className={styles.meta}>{(latencyMs / 1000).toFixed(1)}s</span>
      )}
    </div>
  );
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
