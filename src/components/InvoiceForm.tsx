import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { CalendarIcon, Plus, Trash2, ChevronDown } from "lucide-react";
import { format, addDays, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import type { Invoice, InvoiceItem, InvoiceStatus } from "@/lib/types";
import { generateId, saveInvoice } from "@/lib/storage";
import { useNotify } from "@/hooks/useInvoices";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  open: boolean;
  onClose: () => void;
  editing?: Invoice | null;
}

const addressSchema = z.object({
  street: z.string().trim().min(1, "can't be empty"),
  city: z.string().trim().min(1, "can't be empty"),
  postCode: z.string().trim().min(1, "can't be empty"),
  country: z.string().trim().min(1, "can't be empty"),
});

const itemSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "can't be empty"),
  quantity: z.number().positive("must be > 0"),
  price: z.number().nonnegative("must be ≥ 0"),
  total: z.number(),
});

const fullSchema = z.object({
  senderAddress: addressSchema,
  clientName: z.string().trim().min(1, "can't be empty"),
  clientEmail: z.string().trim().email("invalid email"),
  clientAddress: addressSchema,
  createdAt: z.string().min(1),
  paymentTerms: z.number(),
  description: z.string().trim().min(1, "can't be empty"),
  items: z.array(itemSchema).min(1, "- An item must be added"),
});

type FormState = {
  senderAddress: { street: string; city: string; postCode: string; country: string };
  clientName: string;
  clientEmail: string;
  clientAddress: { street: string; city: string; postCode: string; country: string };
  createdAt: string;
  paymentTerms: number;
  description: string;
  items: InvoiceItem[];
};

const EMPTY: FormState = {
  senderAddress: { street: "", city: "", postCode: "", country: "" },
  clientName: "",
  clientEmail: "",
  clientAddress: { street: "", city: "", postCode: "", country: "" },
  createdAt: format(new Date(), "yyyy-MM-dd"),
  paymentTerms: 30,
  description: "",
  items: [],
};

const TERMS = [1, 7, 14, 30];

function fromInvoice(inv: Invoice): FormState {
  return {
    senderAddress: inv.senderAddress,
    clientName: inv.clientName,
    clientEmail: inv.clientEmail,
    clientAddress: inv.clientAddress,
    createdAt: inv.createdAt,
    paymentTerms: inv.paymentTerms,
    description: inv.description,
    items: inv.items,
  };
}

export function InvoiceForm({ open, onClose, editing }: Props) {
  const notify = useNotify();
  const [state, setState] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (open) {
      setState(editing ? fromInvoice(editing) : EMPTY);
      setErrors({});
      setSubmitAttempted(false);
    }
  }, [open, editing]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  const totalSum = useMemo(
    () => state.items.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.price) || 0), 0),
    [state.items],
  );

  const updateItem = (idx: number, patch: Partial<InvoiceItem>) => {
    setState((s) => {
      const items = [...s.items];
      const next = { ...items[idx], ...patch };
      next.total = (Number(next.quantity) || 0) * (Number(next.price) || 0);
      items[idx] = next;
      return { ...s, items };
    });
  };

  const addItem = () =>
    setState((s) => ({
      ...s,
      items: [...s.items, { id: crypto.randomUUID(), name: "", quantity: 1, price: 0, total: 0 }],
    }));

  const removeItem = (idx: number) =>
    setState((s) => ({ ...s, items: s.items.filter((_, i) => i !== idx) }));

  const buildInvoice = (status: InvoiceStatus): Invoice => {
    const id = editing?.id ?? generateId();
    const paymentDue = format(addDays(parseISO(state.createdAt), state.paymentTerms), "yyyy-MM-dd");
    return {
      id,
      createdAt: state.createdAt,
      paymentDue,
      description: state.description,
      paymentTerms: state.paymentTerms,
      clientName: state.clientName,
      clientEmail: state.clientEmail,
      status,
      senderAddress: state.senderAddress,
      clientAddress: state.clientAddress,
      items: state.items.map((i) => ({ ...i, total: Number(i.quantity) * Number(i.price) })),
      total: totalSum,
    };
  };

  const validate = (): boolean => {
    const result = fullSchema.safeParse(state);
    if (result.success) { setErrors({}); return true; }
    const e: Record<string, string> = {};
    for (const issue of result.error.issues) {
      e[issue.path.join(".")] = issue.message;
    }
    setErrors(e);
    return false;
  };

  const handleSaveDraft = () => {
    // Drafts can be saved without full validation
    const inv = buildInvoice("draft");
    saveInvoice(inv);
    notify();
    onClose();
  };

  const handleSaveSend = () => {
    setSubmitAttempted(true);
    if (!validate()) return;
    const inv = buildInvoice(editing && editing.status !== "draft" ? editing.status : "pending");
    saveInvoice(inv);
    notify();
    onClose();
  };

  const handleSaveChanges = () => {
    setSubmitAttempted(true);
    if (!validate()) return;
    const inv = buildInvoice(editing!.status);
    saveInvoice(inv);
    notify();
    onClose();
  };

  if (!open) return null;

  const fieldErr = (key: string) => submitAttempted && errors[key];
  const itemsErr = submitAttempted && state.items.length === 0;

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 animate-fade-in md:left-[103px]"
      />
      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={editing ? `Edit invoice ${editing.id}` : "New invoice"}
        className="absolute left-0 top-0 md:top-0 md:left-[103px] bottom-0 w-full md:w-[616px] lg:w-[719px] bg-background md:rounded-r-[20px] flex flex-col animate-slide-in-left max-h-screen"
      >
        <div className="flex-1 overflow-y-auto px-6 md:px-12 lg:px-14 pt-8 md:pt-14 pb-8">
          <h2 className="text-2xl font-bold text-foreground mb-10">
            {editing ? <>Edit <span className="text-text-secondary">#</span>{editing.id}</> : "New Invoice"}
          </h2>

          {/* Bill From */}
          <Section title="Bill From">
            <Field label="Street Address" error={fieldErr("senderAddress.street")}
              value={state.senderAddress.street}
              onChange={(v) => setState((s) => ({ ...s, senderAddress: { ...s.senderAddress, street: v } }))}
              className="col-span-full"
            />
            <Field label="City" error={fieldErr("senderAddress.city")}
              value={state.senderAddress.city}
              onChange={(v) => setState((s) => ({ ...s, senderAddress: { ...s.senderAddress, city: v } }))}
            />
            <Field label="Post Code" error={fieldErr("senderAddress.postCode")}
              value={state.senderAddress.postCode}
              onChange={(v) => setState((s) => ({ ...s, senderAddress: { ...s.senderAddress, postCode: v } }))}
            />
            <Field label="Country" error={fieldErr("senderAddress.country")}
              value={state.senderAddress.country}
              onChange={(v) => setState((s) => ({ ...s, senderAddress: { ...s.senderAddress, country: v } }))}
              className="col-span-2 sm:col-span-1"
            />
          </Section>

          {/* Bill To */}
          <Section title="Bill To" className="mt-10">
            <Field label="Client's Name" error={fieldErr("clientName")} className="col-span-full"
              value={state.clientName} onChange={(v) => setState((s) => ({ ...s, clientName: v }))} />
            <Field label="Client's Email" error={fieldErr("clientEmail")} className="col-span-full"
              type="email" placeholder="e.g. email@example.com"
              value={state.clientEmail} onChange={(v) => setState((s) => ({ ...s, clientEmail: v }))} />
            <Field label="Street Address" error={fieldErr("clientAddress.street")} className="col-span-full"
              value={state.clientAddress.street}
              onChange={(v) => setState((s) => ({ ...s, clientAddress: { ...s.clientAddress, street: v } }))} />
            <Field label="City" error={fieldErr("clientAddress.city")}
              value={state.clientAddress.city}
              onChange={(v) => setState((s) => ({ ...s, clientAddress: { ...s.clientAddress, city: v } }))} />
            <Field label="Post Code" error={fieldErr("clientAddress.postCode")}
              value={state.clientAddress.postCode}
              onChange={(v) => setState((s) => ({ ...s, clientAddress: { ...s.clientAddress, postCode: v } }))} />
            <Field label="Country" error={fieldErr("clientAddress.country")} className="col-span-2 sm:col-span-1"
              value={state.clientAddress.country}
              onChange={(v) => setState((s) => ({ ...s, clientAddress: { ...s.clientAddress, country: v } }))} />
          </Section>

          {/* Dates / terms / desc */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label>Invoice Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="w-full flex items-center justify-between bg-card border border-input hover:border-primary focus:border-primary focus:outline-none rounded-md px-5 h-12 text-sm font-bold text-foreground">
                    {format(parseISO(state.createdAt), "dd MMM yyyy")}
                    <CalendarIcon className="w-4 h-4 text-primary" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parseISO(state.createdAt)}
                    onSelect={(d) => d && setState((s) => ({ ...s, createdAt: format(d, "yyyy-MM-dd") }))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Payment Terms</Label>
              <Select value={String(state.paymentTerms)} onValueChange={(v) => setState((s) => ({ ...s, paymentTerms: Number(v) }))}>
                <SelectTrigger className="bg-card border-input hover:border-primary h-12 rounded-md px-5 font-bold text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TERMS.map((t) => (
                    <SelectItem key={t} value={String(t)} className="font-bold">Net {t} Day{t > 1 ? "s" : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Field label="Project Description" placeholder="e.g. Graphic Design Service"
                error={fieldErr("description")}
                value={state.description} onChange={(v) => setState((s) => ({ ...s, description: v }))}
              />
            </div>
          </div>

          {/* Items */}
          <h3 className="text-lg font-bold text-text-secondary mt-16 mb-4">Item List</h3>
          <div className="space-y-4">
            {state.items.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 sm:gap-4 items-end">
                <div className="col-span-12 sm:col-span-5">
                  <Label className={idx === 0 ? "" : "sm:sr-only"}>Item Name</Label>
                  <Input value={item.name} onChange={(v) => updateItem(idx, { name: v })}
                    error={fieldErr(`items.${idx}.name`)} />
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <Label className={idx === 0 ? "" : "sm:sr-only"}>Qty.</Label>
                  <Input type="number" value={String(item.quantity)} onChange={(v) => updateItem(idx, { quantity: Number(v) })}
                    error={fieldErr(`items.${idx}.quantity`)} />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Label className={idx === 0 ? "" : "sm:sr-only"}>Price</Label>
                  <Input type="number" value={String(item.price)} onChange={(v) => updateItem(idx, { price: Number(v) })}
                    error={fieldErr(`items.${idx}.price`)} />
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <Label className={idx === 0 ? "" : "sm:sr-only"}>Total</Label>
                  <p className="h-12 flex items-center font-bold text-muted-foreground">{(item.quantity * item.price).toFixed(2)}</p>
                </div>
                <div className="col-span-2 sm:col-span-1 flex justify-end">
                  <button type="button" onClick={() => removeItem(idx)} aria-label={`Remove item ${idx + 1}`}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addItem}
              className="w-full flex items-center justify-center gap-2 bg-muted hover:bg-muted/70 text-text-secondary font-bold text-sm py-4 rounded-full transition-colors">
              <Plus className="w-3 h-3" /> Add New Item
            </button>
            {itemsErr && <p className="text-destructive text-xs font-semibold">- An item must be added</p>}
            {submitAttempted && Object.keys(errors).length > 0 && (
              <p className="text-destructive text-xs font-semibold">- All fields must be added</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 md:px-12 lg:px-14 py-6 bg-card md:bg-background flex items-center gap-2 justify-end shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          {editing ? (
            <>
              <FooterBtn variant="secondary" onClick={onClose}>Cancel</FooterBtn>
              <FooterBtn variant="primary" onClick={handleSaveChanges}>Save Changes</FooterBtn>
            </>
          ) : (
            <>
              <FooterBtn variant="secondary" onClick={onClose} className="mr-auto">Discard</FooterBtn>
              <FooterBtn variant="dark" onClick={handleSaveDraft}>Save as Draft</FooterBtn>
              <FooterBtn variant="primary" onClick={handleSaveSend}>Save &amp; Send</FooterBtn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-sm font-bold text-primary mb-6">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-6">{children}</div>
    </div>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <label className={cn("block text-sm text-text-secondary mb-2 font-medium", className)}>{children}</label>;
}

function Input({ value, onChange, type = "text", error, placeholder }: {
  value: string; onChange: (v: string) => void; type?: string; error?: string | false; placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full h-12 rounded-md px-5 bg-card border text-sm font-bold text-foreground placeholder:text-muted-foreground/60",
        "focus:outline-none focus:border-primary hover:border-primary transition-colors",
        error ? "border-destructive" : "border-input",
      )}
    />
  );
}

function Field({ label, value, onChange, type = "text", error, className = "", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
  error?: string | false; className?: string; placeholder?: string;
}) {
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <Label>{label}</Label>
        {error && <span className="text-destructive text-[11px] font-semibold">{error}</span>}
      </div>
      <Input value={value} onChange={onChange} type={type} error={error} placeholder={placeholder} />
    </div>
  );
}

function FooterBtn({
  children, onClick, variant, className = "",
}: { children: React.ReactNode; onClick: () => void; variant: "primary" | "secondary" | "dark"; className?: string }) {
  const styles = {
    primary: "bg-primary hover:bg-primary-hover text-primary-foreground",
    secondary: "bg-muted hover:bg-muted/70 text-text-secondary dark:bg-secondary dark:hover:bg-card dark:text-muted-foreground",
    dark: "bg-[hsl(var(--surface-detail))] hover:bg-[hsl(var(--navy))] text-text-secondary",
  } as const;
  return (
    <button type="button" onClick={onClick}
      className={cn("rounded-full px-6 h-12 text-sm font-bold transition-colors", styles[variant], className)}>
      {children}
    </button>
  );
}
