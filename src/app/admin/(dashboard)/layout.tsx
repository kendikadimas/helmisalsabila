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
    <div className="h-screen bg-[#090d13] text-slate-100 flex flex-col md:flex-row overflow-hidden font-sans antialiased selection:bg-teal-500/30 selection:text-white">
      {/* Sidebar */}
      <AdminSidebar logoutAction={logoutAction} userEmail={session.email} />

      {/* Main CMS Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-[#21262d] bg-[#0d1117] px-6 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-300">Admin</span>
            <span>/</span>
            <span className="text-slate-500">Overview</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium text-slate-200">{session.email}</div>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center font-semibold text-slate-300 text-xs">
              A
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-[#090d13]">
          {children}
        </main>
      </div>
    </div>
  );
}
