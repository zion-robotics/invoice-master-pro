import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  invoiceId: string;
  onConfirm: () => void;
}

export function DeleteDialog({ open, onOpenChange, invoiceId, onConfirm }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-lg max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold">Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground leading-relaxed pt-2">
            Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2 sm:justify-end">
          <AlertDialogCancel className="rounded-full px-6 bg-muted hover:bg-muted/80 text-secondary-foreground border-0 font-bold">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="rounded-full px-6 bg-destructive hover:bg-destructive-hover text-destructive-foreground font-bold"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
