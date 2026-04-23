import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import type { Invoice } from "@/lib/types";
import { deleteInvoice, getInvoice, updateStatus } from "@/lib/storage";
import { useInvoices, useNotify } from "@/hooks/useInvoices";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, formatMoney } from "@/lib/format";
import { DeleteDialog } from "@/components/DeleteDialog";
import { InvoiceForm } from "@/components/InvoiceForm";

const InvoiceDetail = () => {
  const { id = "" } = useParams();
  useInvoices(); // subscribe
  const navigate = useNavigate();
  const notify = useNotify();
  const [invoice, setInvoice] = useState<Invoice | undefined>(() => getInvoice(id));
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => { setInvoice(getInvoice(id)); }, [id]);

  if (!invoice) {
    return (
      <div className="max-w-[730px] mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-4 font-bold hover:text-primary transition-colors">
          <ChevronLeft className="w-3 h-3 text-primary" /> Go back
        </Link>
        <p className="mt-12 text-muted-foreground">Invoice not found.</p>
      </div>
    );
  }

  const onMarkPaid = () => { updateStatus(invoice.id, "paid"); notify(); setInvoice(getInvoice(invoice.id)); };
  const onConfirmDelete = () => { deleteInvoice(invoice.id); notify(); navigate("/"); };

  const canMarkPaid = invoice.status === "pending";

  return (
    <div className="max-w-[730px] mx-auto px-6 md:px-10 py-8 md:py-16 pb-32 md:pb-16">
      <Link to="/" className="inline-flex items-center gap-4 font-bold text-foreground hover:text-muted-foreground transition-colors">
        <ChevronLeft className="w-3 h-3 text-primary" /> Go back
      </Link>

      {/* Status bar */}
      <div className="mt-8 bg-card rounded-lg shadow-[0_10px_10px_-10px_rgba(72,84,159,0.10)] px-6 md:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <span className="text-sm text-muted-foreground">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <ActionButtons editing={() => setEditOpen(true)} deleting={() => setDeleteOpen(true)}
            paying={onMarkPaid} canMarkPaid={canMarkPaid} />
        </div>
      </div>

      {/* Invoice card */}
      <div className="mt-6 bg-card rounded-lg shadow-[0_10px_10px_-10px_rgba(72,84,159,0.10)] p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div>
            <h1 className="text-base font-bold text-foreground"><span className="text-text-secondary">#</span>{invoice.id}</h1>
            <p className="text-sm text-muted-foreground mt-2">{invoice.description}</p>
          </div>
          <address className="not-italic text-sm text-muted-foreground md:text-right leading-[1.8]">
            {invoice.senderAddress.street}<br />
            {invoice.senderAddress.city}<br />
            {invoice.senderAddress.postCode}<br />
            {invoice.senderAddress.country}
          </address>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="space-y-8">
            <div>
              <p className="text-sm text-muted-foreground">Invoice Date</p>
              <p className="mt-3 text-base font-bold text-foreground">{formatDate(invoice.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Due</p>
              <p className="mt-3 text-base font-bold text-foreground">{formatDate(invoice.paymentDue)}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bill To</p>
            <p className="mt-3 text-base font-bold text-foreground">{invoice.clientName}</p>
            <address className="not-italic text-sm text-muted-foreground leading-[1.8] mt-2">
              {invoice.clientAddress.street}<br />
              {invoice.clientAddress.city}<br />
              {invoice.clientAddress.postCode}<br />
              {invoice.clientAddress.country}
            </address>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="text-sm text-muted-foreground">Sent to</p>
            <p className="mt-3 text-base font-bold text-foreground break-all">{invoice.clientEmail}</p>
          </div>
        </div>

        {/* Items */}
        <div className="mt-10 bg-muted/40 dark:bg-secondary rounded-t-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <table className="hidden md:table w-full">
              <thead>
                <tr className="text-sm text-muted-foreground">
                  <th className="text-left font-normal pb-7">Item Name</th>
                  <th className="text-center font-normal pb-7">QTY.</th>
                  <th className="text-right font-normal pb-7">Price</th>
                  <th className="text-right font-normal pb-7">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((it) => (
                  <tr key={it.id} className="font-bold text-foreground">
                    <td className="py-2">{it.name}</td>
                    <td className="py-2 text-center text-muted-foreground">{it.quantity}</td>
                    <td className="py-2 text-right text-muted-foreground">{formatMoney(it.price)}</td>
                    <td className="py-2 text-right">{formatMoney(it.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="md:hidden space-y-6">
              {invoice.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">{it.name}</p>
                    <p className="text-sm text-muted-foreground font-bold mt-1">{it.quantity} x {formatMoney(it.price)}</p>
                  </div>
                  <p className="font-bold text-foreground">{formatMoney(it.total)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-[hsl(var(--surface-detail))] dark:bg-[hsl(var(--background))] text-white rounded-b-lg px-6 md:px-8 py-6 flex items-center justify-between">
          <p className="text-sm">Amount Due</p>
          <p className="text-2xl md:text-3xl font-bold">{formatMoney(invoice.total)}</p>
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card px-6 py-5 flex items-center gap-2 justify-center shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
        <ActionButtons editing={() => setEditOpen(true)} deleting={() => setDeleteOpen(true)}
          paying={onMarkPaid} canMarkPaid={canMarkPaid} />
      </div>

      <DeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} invoiceId={invoice.id} onConfirm={onConfirmDelete} />
      <InvoiceForm open={editOpen} onClose={() => { setEditOpen(false); setInvoice(getInvoice(invoice.id)); }} editing={invoice} />
    </div>
  );
};

function ActionButtons({ editing, deleting, paying, canMarkPaid }: {
  editing: () => void; deleting: () => void; paying: () => void; canMarkPaid: boolean;
}) {
  return (
    <>
      <button type="button" onClick={editing}
        className="rounded-full px-5 h-12 bg-muted hover:bg-muted/70 text-text-secondary dark:bg-secondary dark:hover:bg-card dark:text-muted-foreground font-bold text-sm transition-colors">
        Edit
      </button>
      <button type="button" onClick={deleting}
        className="rounded-full px-5 h-12 bg-destructive hover:bg-destructive-hover text-destructive-foreground font-bold text-sm transition-colors">
        Delete
      </button>
      <button type="button" onClick={paying} disabled={!canMarkPaid}
        className="rounded-full px-5 h-12 bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        Mark as Paid
      </button>
    </>
  );
}

export default InvoiceDetail;
