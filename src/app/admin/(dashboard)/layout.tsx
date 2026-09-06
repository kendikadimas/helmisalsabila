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
    <div className="h-screen bg-[#090d13] text-slate-100 flex flex-col md:flex-row overflow-hidden font-sans antialiased selection:bg-teal-500/30 selection:text-white text-sm">
      {/* Sidebar */}
      <AdminSidebar logoutAction={logoutAction} userEmail={session.email} />

      {/* Main CMS Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#21262d] bg-[#0d1117] px-8 lg:px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 text-sm text-slate-400">
            <span className="font-semibold text-slate-200">Admin</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">Overview</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-slate-200">{session.email}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#161b22] border border-[#30363d] flex items-center justify-center font-bold text-teal-400 text-sm">
              A
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8 lg:p-10 xl:p-12 overflow-y-auto bg-[#090d13]">
          {children}
        </main>
      </div>
    </div>
  );
}
