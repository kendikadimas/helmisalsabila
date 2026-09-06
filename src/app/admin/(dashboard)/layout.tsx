import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import AdminSidebar from "@/components/AdminSidebar";
import { ShieldCheck, Bell, Search, UserCheck } from "lucide-react";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="h-screen bg-[#0B0F17] text-slate-100 flex flex-col md:flex-row overflow-hidden font-sans selection:bg-teal-500 selection:text-white">
      {/* Client Sidebar - Full Height Sticky */}
      <AdminSidebar logoutAction={logoutAction} userEmail={session.email} />

      {/* Main CMS Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">Content Management System</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white flex items-center gap-1 justify-end">
                  <span>Helmi Salsabila</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                </div>
                <div className="text-[10px] text-slate-400">Super Administrator</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 p-[1.5px] shadow-sm">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-bold text-teal-400 text-xs">
                  HS
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body with scrollable content */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto bg-gradient-to-b from-[#0B0F17] via-[#0D131F] to-[#0B0F17]">
          {children}
        </main>
      </div>
    </div>
  );
}
