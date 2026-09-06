import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import AdminSidebar from "@/components/AdminSidebar";

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
    <div className="h-screen bg-[#F1F5F9] text-slate-800 flex flex-col md:flex-row overflow-hidden font-sans antialiased selection:bg-teal-500/20 selection:text-teal-900 text-sm">
      {/* Dark Sidebar */}
      <AdminSidebar logoutAction={logoutAction} userEmail={session.email} />

      {/* Main CMS Area - Soft Muted Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#F1F5F9]">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200/90 bg-white/80 backdrop-blur-md px-8 lg:px-10 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5 text-sm text-slate-500">
            <span className="font-semibold text-slate-700">Admin</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600 font-medium">Overview</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-800">{session.email}</div>
              <div className="text-[11px] text-slate-400">Super Administrator</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-teal-400 flex items-center justify-center font-bold text-sm shadow-xs">
              A
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8 lg:p-10 xl:p-12 overflow-y-auto bg-[#F1F5F9]">
          {children}
        </main>
      </div>
    </div>
  );
}
