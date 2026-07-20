import { Lato } from "next/font/google";
import "../admin.css";
import StoreProvider from "../../redux";
import { AdminRedirectGuard } from "@/components/auth/AdminRedirectGuard";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
});

export const metadata = {
  title: "Admin Login",
};

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`admin-panel ${lato.className} min-h-screen`}>
      <StoreProvider>
        <AdminRedirectGuard>{children}</AdminRedirectGuard>
      </StoreProvider>
    </div>
  );
}
