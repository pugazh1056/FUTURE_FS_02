CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Recreate policies to reference private.has_role
DROP POLICY IF EXISTS "Owners and admins can view leads" ON public.leads;
DROP POLICY IF EXISTS "Owners and admins can update leads" ON public.leads;
DROP POLICY IF EXISTS "Owners and admins can delete leads" ON public.leads;
DROP POLICY IF EXISTS "View notes on accessible leads" ON public.lead_notes;
DROP POLICY IF EXISTS "Insert notes on accessible leads" ON public.lead_notes;
DROP POLICY IF EXISTS "Authors and admins can delete notes" ON public.lead_notes;

CREATE POLICY "Owners and admins can view leads" ON public.leads
  FOR SELECT USING (auth.uid() = owner_id OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners and admins can update leads" ON public.leads
  FOR UPDATE USING (auth.uid() = owner_id OR private.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = owner_id OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners and admins can delete leads" ON public.leads
  FOR DELETE USING (auth.uid() = owner_id OR private.has_role(auth.uid(), 'admin'));

CREATE POLICY "View notes on accessible leads" ON public.lead_notes
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.leads l
    WHERE l.id = lead_notes.lead_id
      AND (l.owner_id = auth.uid() OR private.has_role(auth.uid(), 'admin'))
  ));
CREATE POLICY "Insert notes on accessible leads" ON public.lead_notes
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = lead_notes.lead_id
        AND (l.owner_id = auth.uid() OR private.has_role(auth.uid(), 'admin'))
    )
  );
CREATE POLICY "Authors and admins can delete notes" ON public.lead_notes
  FOR DELETE USING (auth.uid() = author_id OR private.has_role(auth.uid(), 'admin'));

-- Drop the publicly exposed function
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);