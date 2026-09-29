"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import styles from "./Composer.module.css";

export function Composer({
  onSend,
  busy,
  autoFocus,
}: {
  onSend: (text: string) => void;
  busy: boolean;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [value]);

  const submit = () => {
    const text = value.trim();
    if (!text || busy) return;
    onSend(text);
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  const canSend = value.trim().length > 0 && !busy;

  return (
    <div className={styles.card}>
      <textarea
        ref={ref}
        className={styles.input}
        placeholder="Ask about orders, refunds, billing, delivery…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        autoFocus={autoFocus}
        aria-label="Message SupportSage"
      />
      <div className={styles.bar}>
        <span className={styles.hint}>
          <kbd>Enter</kbd> to send · <kbd>Shift</kbd>+<kbd>Enter</kbd> for a new line
        </span>
        <button
          type="button"
          className={styles.send}
          onClick={submit}
          disabled={!canSend}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
