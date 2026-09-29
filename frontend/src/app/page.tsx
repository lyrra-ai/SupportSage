"use client";

import { useEffect, useRef, useState } from "react";
import { queryAgent } from "@/lib/api";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import styles from "./page.module.css";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const userMsg: ChatMessageType = { id: crypto.randomUUID(), role: "user", text };
    const assistantId = crypto.randomUUID();
    const assistantMsg: ChatMessageType = {
      id: assistantId,
      role: "assistant",
      text: "",
      pending: true,
    };
    setMessages((m) => [...m, userMsg, assistantMsg]);
    setBusy(true);

    const start = performance.now();
    try {
      const response = await queryAgent(text);
      const latencyMs = performance.now() - start;
      setMessages((m) =>
        m.map((msg) =>
          msg.id === assistantId ? { ...msg, pending: false, response, latencyMs } : msg,
        ),
      );
    } catch {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                pending: false,
                error:
                  "Couldn't reach SupportSage. The free-tier backend may be cold-starting — try again in a moment.",
              }
            : msg,
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>S</div>
          <div>
            <div className={styles.title}>SupportSage</div>
            <div className={styles.subtitle}>Hybrid RAG · Guardrails · Model tiering</div>
          </div>
        </div>
        <div className={styles.status}>
          <span className={styles.statusDot} />
          Railway
        </div>
      </header>

      <div className={styles.scroll} ref={scrollRef}>
        {messages.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyTitle}>Ask a customer support question</div>
            <div className={styles.emptySub}>
              Every answer is grounded in a real knowledge base, routed by complexity, and
              checked by input/output guardrails — try the prompt-injection example below.
            </div>
          </div>
        ) : (
          messages.map((m) => <ChatMessage key={m.id} message={m} />)
        )}
      </div>

      <div className={styles.footer}>
        <ChatInput onSend={send} disabled={busy} />
      </div>
    </div>
  );
}
