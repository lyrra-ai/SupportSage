"use client";

import { useState } from "react";
import { StreamingText } from "@aicss/react/streaming-text";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { PipelineProgress } from "./PipelineProgress";
import { RouteBadge } from "./RouteBadge";
import { SourceCitations } from "./SourceCitations";
import { GuardrailAlert } from "./GuardrailAlert";
import styles from "./ChatMessage.module.css";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const [copied, setCopied] = useState(false);

  if (message.role === "user") {
    return (
      <div className={styles.row} data-role="user">
        <div className={`${styles.bubble} ${styles.userBubble}`}>{message.text}</div>
      </div>
    );
  }

  const copy = async () => {
    if (!message.response) return;
    try {
      await navigator.clipboard.writeText(message.response.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard unavailable, ignore */
    }
  };

  return (
    <div className={styles.row} data-role="assistant">
      <div className={`${styles.bubble} ${styles.assistantCard}`}>
        {message.pending && <PipelineProgress />}

        {message.error && <p className={styles.errorText}>{message.error}</p>}

        {message.response && (
          <>
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <RouteBadge route={message.response.route} />
              </div>
              {message.latencyMs !== undefined && (
                <span className={styles.meta}>{(message.latencyMs / 1000).toFixed(1)}s</span>
              )}
            </div>

            <StreamingText text={message.response.answer} />

            <GuardrailAlert response={message.response} />
            <SourceCitations sources={message.response.sources} />

            <div className={styles.footer}>
              <button type="button" className={styles.copyBtn} onClick={copy}>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
