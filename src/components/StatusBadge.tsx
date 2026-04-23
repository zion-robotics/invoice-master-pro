import type { InvoiceStatus } from "@/lib/types";

const LABELS: Record<InvoiceStatus, string> = { paid: "Paid", pending: "Pending", draft: "Draft" };

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const cls = status === "paid" ? "status-paid" : status === "pending" ? "status-pending" : "status-draft";
  return (
    <span className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold w-[104px] justify-center ${cls}`}>
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "currentColor" }} aria-hidden />
      {LABELS[status]}
    </span>
  );
}
