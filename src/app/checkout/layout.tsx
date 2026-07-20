import StoreProvider from "../redux";
import { AdminRedirectGuard } from "@/components/auth/AdminRedirectGuard";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <AdminRedirectGuard>{children}</AdminRedirectGuard>
    </StoreProvider>
  );
}
