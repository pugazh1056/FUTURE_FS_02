import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type LeadStatus = "new" | "contacted" | "converted";

const styles: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300",
  contacted:
    "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300",
  converted:
    "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300",
};

const labels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge variant="secondary" className={cn("font-medium border-0", styles[status])}>
      {labels[status]}
    </Badge>
  );
}
