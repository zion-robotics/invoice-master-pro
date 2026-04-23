import { useCallback, useEffect, useSyncExternalStore } from "react";
import { ensureSeed, getAllInvoices, getInvoice } from "@/lib/storage";
import type { Invoice } from "@/lib/types";

const listeners = new Set<() => void>();

export function notifyInvoicesChanged() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// Cache the last array reference so stringify only happens when data actually changes
let _cache: Invoice[] = [];
let _cacheStr = "[]";

function getSnapshot(): string {
  const next = getAllInvoices();
  const nextStr = JSON.stringify(next);
  if (nextStr !== _cacheStr) {
    _cache = next;
    _cacheStr = nextStr;
  }
  return _cacheStr;
}

export function useInvoices(): Invoice[] {
  useEffect(() => { ensureSeed(); }, []);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  return snapshot === _cacheStr ? _cache : (JSON.parse(snapshot) as Invoice[]);
}

// Derive a single invoice reactively — no separate useState needed
export function useInvoice(id: string): Invoice | undefined {
  const invoices = useInvoices();
  return invoices.find((i) => i.id === id);
}

export function useNotify() {
  return useCallback(() => notifyInvoicesChanged(), []);
}