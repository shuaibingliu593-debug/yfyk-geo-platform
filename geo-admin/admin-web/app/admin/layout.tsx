import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";
import { AdminSidebar, MobileAdminNav } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-background">
        <div className="flex min-h-screen">
          <AdminSidebar />
          <div className="min-w-0 flex-1">
            <MobileAdminNav />
            {children}
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
