import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getLead, updateLeadStatus, addLeadNote } from "@/lib/leads.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge, type LeadStatus } from "@/components/status-badge";
import { ArrowLeft, Mail, Phone, Tag, Calendar } from "lucide-react";
import { toast } from "sonner";

const leadQuery = (id: string) =>
  queryOptions({
    queryKey: ["lead", id],
    queryFn: () => getLead({ data: { id } }),
  });

export const Route = createFileRoute("/_authenticated/leads/$leadId")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(leadQuery(params.leadId)),
  component: LeadDetail,
});

function LeadDetail() {
  const { leadId } = Route.useParams();
  const { data } = useSuspenseQuery(leadQuery(leadId));
  const { lead, notes } = data;
  const qc = useQueryClient();
  const updateStatus = useServerFn(updateLeadStatus);
  const addNote = useServerFn(addLeadNote);
  const [note, setNote] = useState("");

  const statusMut = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lead", leadId] });
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success("Status updated");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const noteMut = useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      setNote("");
      qc.invalidateQueries({ queryKey: ["lead", leadId] });
      toast.success("Note added");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to add note"),
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        to="/leads"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to leads
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{lead.name}</h1>
          <StatusBadge status={lead.status as LeadStatus} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Update status:</span>
          <Select
            value={lead.status}
            onValueChange={(v) =>
              statusMut.mutate({ data: { id: lead.id, status: v as LeadStatus } })
            }
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact information</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
          <InfoRow icon={Mail} label="Email" value={lead.email} />
          <InfoRow icon={Phone} label="Phone" value={lead.phone} />
          <InfoRow icon={Tag} label="Source" value={lead.source} />
          <InfoRow
            icon={Calendar}
            label="Created"
            value={new Date(lead.created_at).toLocaleString()}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Follow-up notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!note.trim()) return;
              noteMut.mutate({ data: { leadId, body: note.trim() } });
            }}
            className="space-y-2"
          >
            <Textarea
              placeholder="Add a follow-up note…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!note.trim() || noteMut.isPending} size="sm">
                {noteMut.isPending ? "Saving…" : "Add note"}
              </Button>
            </div>
          </form>

          <div className="space-y-3">
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No notes yet. Add the first follow-up note above.
              </p>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="rounded-md border p-3 space-y-1 bg-muted/30">
                  <div className="text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleString()}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{n.body}</div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="size-4 mt-0.5 text-muted-foreground" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium">{value || "—"}</div>
      </div>
    </div>
  );
}
