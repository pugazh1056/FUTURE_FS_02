import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthLayout,
});

function AuthLayout() {
  const { user } = Route.useRouteContext();
  return (
    <SidebarProvider>
      <AppSidebar email={user.email ?? ""} />
      <SidebarInset>
        <header className="h-14 flex items-center gap-3 border-b px-4 sticky top-0 bg-background/80 backdrop-blur z-10">
          <SidebarTrigger />
          <div className="text-sm text-muted-foreground">Mini CRM</div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
