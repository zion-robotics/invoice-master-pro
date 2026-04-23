import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Invoice } from "@/lib/types";
import { formatDate, formatMoney } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  return (
    <Link
      to={`/invoice/${invoice.id}`}
      className="block bg-card rounded-lg shadow-[0_10px_10px_-10px_rgba(72,84,159,0.10)] hover:ring-1 hover:ring-primary transition-all p-6 group"
    >
      <div className="md:hidden flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="font-bold text-foreground"><span className="text-text-secondary">#</span>{invoice.id}</p>
          <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Due {formatDate(invoice.paymentDue)}</p>
            <p className="text-xl font-bold text-foreground">{formatMoney(invoice.total)}</p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      <div className="hidden md:grid grid-cols-[80px_1fr_1fr_1fr_120px_24px] items-center gap-4">
        <p className="font-bold text-foreground"><span className="text-text-secondary">#</span>{invoice.id}</p>
        <p className="text-sm text-muted-foreground">Due {formatDate(invoice.paymentDue)}</p>
        <p className="text-sm text-muted-foreground truncate">{invoice.clientName}</p>
        <p className="text-base font-bold text-foreground">{formatMoney(invoice.total)}</p>
        <StatusBadge status={invoice.status} />
        <ChevronRight className="w-3 h-3 text-primary justify-self-end transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
