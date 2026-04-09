import { Lato } from "next/font/google";
import { AdminSidebar } from "@/components/admin/sidebar/AdminSidebar";
import { AdminNavbar } from "@/components/admin/navbar/AdminNavbar";
import "./admin.css";
import StoreProvider from "../redux";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
});

export const metadata = {
  title: "Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`admin-panel ${lato.className} flex min-h-screen`}>
      <StoreProvider>          
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminNavbar />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </StoreProvider>
    </div>
  );
}
