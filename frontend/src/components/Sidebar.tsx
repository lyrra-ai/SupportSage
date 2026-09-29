"use client";

import { Orb } from "@aicss/react/orbs";
import { setTheme, useTheme } from "@/lib/browser";
import type { Conversation } from "@/lib/types";
import type { BackendStatus } from "@/lib/useBackendStatus";
import { Logo } from "./Logo";
import styles from "./Sidebar.module.css";

export function Sidebar({
  conversations,
  activeId,
  status,
  open,
  onSelect,
  onNew,
  onDelete,
  onClose,
}: {
  conversations: Conversation[];
  activeId: string | null;
  status: BackendStatus;
  open: boolean | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className={styles.scrim} data-open={open ?? "auto"} onClick={onClose} aria-hidden="true" />
      <aside className={styles.sidebar} data-open={open ?? "auto"}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo />
            <span className={styles.brandName}>SupportSage</span>
          </div>
          <button type="button" className={styles.iconBtn} onClick={onClose} aria-label="Close sidebar">
            <SidebarIcon />
          </button>
        </div>

        <button type="button" className={styles.newChat} onClick={onNew}>
          <span className={styles.newChatIcon}>
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          New chat
        </button>

        <nav className={styles.recents} aria-label="Recent conversations">
          {conversations.length > 0 && <div className={styles.sectionLabel}>Recents</div>}
          {conversations.map((c) => (
            <div key={c.id} className={styles.item} data-active={c.id === activeId}>
              <button type="button" className={styles.itemBtn} onClick={() => onSelect(c.id)}>
                {c.title}
              </button>
              <button
                type="button"
                className={styles.itemDelete}
                onClick={() => onDelete(c.id)}
                aria-label={`Delete “${c.title}”`}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </nav>

        <div className={styles.pipeline}>
          <div className={styles.sectionLabel}>Pipeline</div>
          <ol className={styles.steps}>
            <li>Input guardrails</li>
            <li>Complexity router</li>
            <li>Hybrid search + rerank</li>
            <li>Tiered generation</li>
            <li>Output guardrails</li>
          </ol>
        </div>

        <div className={styles.footer}>
          <StatusRow status={status} />
          <div className={styles.footerActions}>
            <a
              className={styles.iconBtn}
              href="https://github.com/lyrra-ai/SupportSage"
              target="_blank"
              rel="noreferrer"
              aria-label="Source on GitHub"
              title="Source on GitHub"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
                />
              </svg>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}

function StatusRow({ status }: { status: BackendStatus }) {
  return (
    <div className={styles.status} data-status={status}>
      {status === "online" ? (
        <span className={styles.statusDot} />
      ) : (
        <span className={styles.statusOrb}>
          <Orb variant={status === "checking" ? "C1" : "G5"} size={14} />
        </span>
      )}
      <span>
        {status === "online" && "Backend online · Railway"}
        {status === "checking" && "Connecting to backend…"}
        {status === "unreachable" && "Backend waking up…"}
      </span>
    </div>
  );
}

function ThemeToggle() {
  const theme = useTheme();

  return (
    <button
      type="button"
      className={styles.iconBtn}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title="Toggle theme"
    >
      {theme === "light" ? (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

export function SidebarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9.5 4.5v15" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
