import type { Invoice, InvoiceStatus } from "./types";
import { SEED_INVOICES } from "./seed";

const KEY = "invoices.v1";
const SEEDED_KEY = "invoices.seeded.v1";

function read(): Invoice[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function write(list: Invoice[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function ensureSeed() {
  if (!localStorage.getItem(SEEDED_KEY)) {
    write(SEED_INVOICES);
    localStorage.setItem(SEEDED_KEY, "1");
  }
}

export function getAllInvoices(): Invoice[] {
  ensureSeed();
  return read().sort((a, b) => (a.paymentDue < b.paymentDue ? 1 : -1));
}

export function getInvoice(id: string): Invoice | undefined {
  return read().find((i) => i.id === id);
}

export function saveInvoice(inv: Invoice) {
  const list = read();
  const idx = list.findIndex((i) => i.id === inv.id);
  if (idx >= 0) list[idx] = inv;
  else list.unshift(inv);
  write(list);
}

export function deleteInvoice(id: string) {
  write(read().filter((i) => i.id !== id));
}

export function updateStatus(id: string, status: InvoiceStatus) {
  const list = read();
  const idx = list.findIndex((i) => i.id === id);
  if (idx >= 0) {
    list[idx].status = status;
    write(list);
  }
}

export function generateId(): string {
  // 2 letters + 4 digits, like RT3080
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const a = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
  const n = Math.floor(1000 + Math.random() * 9000);
  return `${a}${n}`;
}
