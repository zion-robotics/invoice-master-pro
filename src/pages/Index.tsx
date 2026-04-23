import { useMemo, useState } from "react";
import { useInvoices } from "@/hooks/useInvoices";
import { ListHeader } from "@/components/ListHeader";
import { InvoiceCard } from "@/components/InvoiceCard";
import { EmptyState } from "@/components/EmptyState";
import { InvoiceForm } from "@/components/InvoiceForm";
import type { InvoiceStatus } from "@/lib/types";

const Index = () => {
  const invoices = useInvoices();
  const [filters, setFilters] = useState<InvoiceStatus[]>([]);
  const [formOpen, setFormOpen] = useState(false);

  const filtered = useMemo(
    () => (filters.length === 0 ? invoices : invoices.filter((i) => filters.includes(i.status))),
    [invoices, filters],
  );

  return (
    <div className="max-w-[730px] mx-auto px-6 md:px-10 py-8 md:py-16">
      <ListHeader
        count={filtered.length}
        filters={filters}
        onFiltersChange={setFilters}
        onNew={() => setFormOpen(true)}
      />
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {filtered.map((inv) => <InvoiceCard key={inv.id} invoice={inv} />)}
        </div>
      )}
      <InvoiceForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
};

export default Index;
