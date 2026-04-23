import { useCallback, useEffect, useSyncExternalStore } from "react";
import { ensureSeed, getAllInvoices } from "@/lib/storage";

const listeners = new Set<() => void>();

export function notifyInvoicesChanged() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useInvoices() {
  useEffect(() => { ensureSeed(); }, []);
  const snapshot = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(getAllInvoices()),
    () => "[]",
  );
  return JSON.parse(snapshot) as ReturnType<typeof getAllInvoices>;
}

export function useNotify() {
  return useCallback(() => notifyInvoicesChanged(), []);
}
