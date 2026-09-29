import type { Conversation } from "./types";

const KEY = "supportsage.conversations.v1";
const EMPTY: Conversation[] = [];

let state: Conversation[] | null = null;
const listeners = new Set<() => void>();

function load(): Conversation[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    // A reload mid-request leaves pending placeholders behind.
    return parsed.map((c) => ({
      ...c,
      messages: c.messages.map((m) =>
        m.pending ? { ...m, pending: false, error: "Interrupted — the page was reloaded." } : m,
      ),
    }));
  } catch {
    return [];
  }
}

function save(conversations: Conversation[]) {
  try {
    const clean = conversations.map((c) => ({
      ...c,
      messages: c.messages.map((m) => {
        const copy = { ...m };
        delete copy.fresh;
        return copy;
      }),
    }));
    localStorage.setItem(KEY, JSON.stringify(clean));
  } catch {
    /* storage unavailable (private mode, quota) — history just won't persist */
  }
}

/** localStorage-backed conversation store for useSyncExternalStore. */
export const conversationStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): Conversation[] {
    if (state === null) state = load();
    return state;
  },
  getServerSnapshot(): Conversation[] {
    return EMPTY;
  },
  update(fn: (conversations: Conversation[]) => Conversation[]) {
    state = fn(conversationStore.getSnapshot());
    save(state);
    listeners.forEach((l) => l());
  },
};
