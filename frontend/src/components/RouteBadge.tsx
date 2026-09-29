import type { Route } from "@/lib/types";
import styles from "./RouteBadge.module.css";

export function RouteBadge({ route }: { route: Route }) {
  return (
    <span className={`${styles.badge} ${styles[route]}`}>
      <span className={styles.dot} />
      {route}
    </span>
  );
}
