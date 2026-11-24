import type { Metadata } from "next";
import { AdminShell } from "@/admin/components/AdminShell";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Counter", template: "%s | EcoSpin Counter" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root flex min-h-full flex-1 flex-col">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
