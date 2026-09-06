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
    <div className="h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row overflow-hidden font-sans antialiased selection:bg-teal-500/20 selection:text-teal-900 text-sm">
      {/* Sidebar */}
      <AdminSidebar logoutAction={logoutAction} userEmail={session.email} />

      {/* Main CMS Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-200 bg-white px-8 lg:px-10 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5 text-sm text-slate-500">
            <span className="font-semibold text-slate-800">Admin</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-600">Overview</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-slate-800">{session.email}</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center font-bold text-teal-700 text-sm shadow-xs">
              A
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8 lg:p-10 xl:p-12 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
