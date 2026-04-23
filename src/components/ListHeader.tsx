import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import type { InvoiceStatus } from "@/lib/types";

interface Props {
  count: number;
  filters: InvoiceStatus[];
  onFiltersChange: (f: InvoiceStatus[]) => void;
  onNew: () => void;
}

const OPTIONS: InvoiceStatus[] = ["draft", "pending", "paid"];

export function ListHeader({ count, filters, onFiltersChange, onNew }: Props) {
  const [open, setOpen] = useState(false);
  const toggle = (s: InvoiceStatus) => {
    if (filters.includes(s)) onFiltersChange(filters.filter((x) => x !== s));
    else onFiltersChange([...filters, s]);
  };
  return (
    <div className="flex items-center justify-between mb-8 md:mb-14">
      <div>
        <h1 className="text-2xl md:text-4xl font-bold text-foreground">Invoices</h1>
        <p className="text-sm text-muted-foreground mt-1">
          <span className="hidden md:inline">There are </span>
          {count} <span className="hidden sm:inline">total </span>invoices
        </p>
      </div>
      <div className="flex items-center gap-4 md:gap-10">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="flex items-center gap-2 md:gap-3 font-bold text-sm text-foreground hover:text-primary transition-colors">
            <span className="hidden sm:inline">Filter by status</span>
            <span className="sm:hidden">Filter</span>
            <ChevronDown className={`w-3 h-3 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
          </PopoverTrigger>
          <PopoverContent className="w-48 p-6 rounded-lg shadow-xl border-0" align="end">
            <div className="space-y-3">
              {OPTIONS.map((s) => (
                <label key={s} className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    checked={filters.includes(s)}
                    onCheckedChange={() => toggle(s)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-muted bg-muted hover:border-primary"
                  />
                  <span className="text-sm font-bold capitalize text-foreground">{s}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <button
          type="button"
          onClick={onNew}
          className="flex items-center gap-2 md:gap-4 bg-primary hover:bg-primary-hover text-primary-foreground rounded-full pl-2 pr-4 md:pr-6 py-2 transition-colors"
        >
          <span className="w-8 h-8 rounded-full bg-white grid place-items-center">
            <Plus className="w-3 h-3 text-primary" />
          </span>
          <span className="font-bold text-sm">
            <span className="hidden sm:inline">New Invoice</span>
            <span className="sm:hidden">New</span>
          </span>
        </button>
      </div>
    </div>
  );
}
