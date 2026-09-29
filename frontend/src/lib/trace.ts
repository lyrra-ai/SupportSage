import type { OrbVariant } from "@aicss/react/orbs";
import type { QueryResponse } from "./types";

/** Shown while a request is in flight — mirrors the backend's stage order. */
export const PENDING_STAGES: { orb: OrbVariant; label: string; text: string; ms: number }[] = [
  {
    orb: "C4",
    label: "Checking guardrails…",
    text: "Checking input guardrails for prompt-injection patterns and PII…",
    ms: 700,
  },
  {
    orb: "B5",
    label: "Routing query…",
    text: "Classifying query complexity as SIMPLE, COMPLEX, or ESCALATE…",
    ms: 1000,
  },
  {
    orb: "B2",
    label: "Searching knowledge base…",
    text: "Running hybrid search — BM25 keywords plus Pinecone vectors, then reranking…",
    ms: 1300,
  },
  {
    orb: "B3",
    label: "Generating answer…",
    text: "Drafting an answer grounded only in the retrieved support articles…",
    ms: Infinity,
  },
];

/** What actually happened, reconstructed from the response fields. */
export function buildTrace(r: QueryResponse): string[] {
  if (r.route === "BLOCKED") {
    return [
      "Input guardrails flagged this query as prompt injection or out of scope.",
      "Stopped before routing, retrieval, or any model call.",
    ];
  }

  const lines = [
    r.pii_detected.length
      ? `Input guardrails passed. Redacted PII before processing: ${r.pii_detected.join(", ")}.`
      : "Input guardrails passed — no injection patterns or PII found.",
  ];

  if (r.route === "ESCALATE") {
    lines.push("Router classified this as ESCALATE and handed it to a human agent.");
    return lines;
  }

  lines.push(
    r.route === "COMPLEX"
      ? "Router classified this as COMPLEX, so it went to the larger openai/gpt-oss-120b tier."
      : "Router classified this as SIMPLE, so it went to the fast openai/gpt-oss-20b tier.",
  );

  if (r.sources.length) {
    const intents = [...new Set(r.sources.map((s) => `${s.category}/${s.intent}`))];
    lines.push(`Hybrid search reranked ${r.sources.length} sources: ${intents.join(", ")}.`);
  } else {
    lines.push("Hybrid search found no relevant support articles.");
  }

  lines.push(
    r.is_refusal
      ? "Output guardrails replaced the draft answer with a safe fallback."
      : "Output guardrails passed — answer is grounded in retrieved context.",
  );
  return lines;
}
