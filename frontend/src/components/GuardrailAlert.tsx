import type { QueryResponse } from "@/lib/types";
import styles from "./GuardrailAlert.module.css";

export function GuardrailAlert({ response }: { response: QueryResponse }) {
  return (
    <>
      {response.route === "BLOCKED" && (
        <div className={`${styles.alert} ${styles.blocked}`}>
          <ShieldIcon />
          <span>
            Input guardrail triggered — prompt injection or out-of-scope query blocked before
            reaching the model.
          </span>
        </div>
      )}
      {response.escalate && response.route !== "BLOCKED" && (
        <div className={`${styles.alert} ${styles.escalate}`}>
          <FlagIcon />
          <span>Escalated to a human agent.</span>
        </div>
      )}
      {response.pii_detected.length > 0 && (
        <div className={`${styles.alert} ${styles.pii}`}>
          <EyeIcon />
          <span>PII redacted: {response.pii_detected.join(", ")}</span>
        </div>
      )}
    </>
  );
}

function ShieldIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d="M5 21V4m0 1 3.3-1.3a3 3 0 0 1 2.4 0L11 4l.3.15a3 3 0 0 0 2.4 0L17 3v9l-3.3 1.3a3 3 0 0 1-2.4 0L11 13l-.3-.15a3 3 0 0 0-2.4 0L5 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
