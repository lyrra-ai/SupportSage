export type Route = "SIMPLE" | "COMPLEX" | "ESCALATE" | "BLOCKED";

export interface Source {
  category: string;
  intent: string;
  original_question: string;
}

export interface QueryResponse {
  answer: string;
  route: Route;
  sources: Source[];
  escalate: boolean;
  pii_detected: string[];
  is_refusal: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  response?: QueryResponse;
  latencyMs?: number;
  pending?: boolean;
  error?: string;
}
