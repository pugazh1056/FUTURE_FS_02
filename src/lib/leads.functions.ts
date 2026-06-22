import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const leadStatusSchema = z.enum(["new", "contacted", "converted"]);

const createLeadSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  source: z.string().trim().max(80).optional().or(z.literal("")),
  status: leadStatusSchema.default("new"),
});

const updateStatusSchema = z.object({
  id: z.string().uuid(),
  status: leadStatusSchema,
});

const noteSchema = z.object({
  leadId: z.string().uuid(),
  body: z.string().trim().min(1, "Note cannot be empty").max(2000),
});

export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase.from("leads").select("status");
    if (error) throw new Error(error.message);
    const rows = data ?? [];
    return {
      total: rows.length,
      new: rows.filter((r) => r.status === "new").length,
      contacted: rows.filter((r) => r.status === "contacted").length,
      converted: rows.filter((r) => r.status === "converted").length,
    };
  });

export const listLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("leads")
      .select("id,name,email,phone,source,status,created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getLead = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const [leadRes, notesRes] = await Promise.all([
      supabase.from("leads").select("*").eq("id", data.id).maybeSingle(),
      supabase
        .from("lead_notes")
        .select("id,body,author_id,created_at")
        .eq("lead_id", data.id)
        .order("created_at", { ascending: false }),
    ]);
    if (leadRes.error) throw new Error(leadRes.error.message);
    if (!leadRes.data) throw new Error("Lead not found");
    if (notesRes.error) throw new Error(notesRes.error.message);
    return { lead: leadRes.data, notes: notesRes.data ?? [] };
  });

export const createLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createLeadSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("leads")
      .insert({
        owner_id: userId,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        source: data.source || null,
        status: data.status,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateLeadStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => updateStatusSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { error } = await supabase
      .from("leads")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const addLeadNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => noteSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("lead_notes").insert({
      lead_id: data.leadId,
      author_id: userId,
      body: data.body,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
