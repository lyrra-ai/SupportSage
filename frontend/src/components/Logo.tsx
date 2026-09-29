export function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path
        d="M19.5 3.5c-8.3.2-14 4.6-14.6 11.6-.1 1.3 0 2.6.3 3.9 1.7-4.6 5.2-8.1 9.8-10.1-3.7 2.6-6.6 6.2-8.2 10.6 1.1.3 2.3.4 3.4.3 7-.6 10.9-6.9 9.3-16.3Z"
        fill="var(--accent)"
      />
    </svg>
  );
}
