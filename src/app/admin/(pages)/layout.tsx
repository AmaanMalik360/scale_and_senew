import { Lato } from "next/font/google";
import { AdminSidebar } from "@/components/admin/sidebar/AdminSidebar";
import { AdminNavbar } from "@/components/admin/navbar/AdminNavbar";
import "../admin.css";
import StoreProvider from "../../redux";
import { AdminAuthGuard } from "@/components/auth/AdminAuthGuard";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
});

export const metadata = {
  title: "Admin Dashboard",
};

export default function AdminPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`admin-panel ${lato.className} flex min-h-screen`}>
      <StoreProvider>
        <AdminAuthGuard>
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AdminNavbar />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </AdminAuthGuard>
      </StoreProvider>
    </div>
  );
}
