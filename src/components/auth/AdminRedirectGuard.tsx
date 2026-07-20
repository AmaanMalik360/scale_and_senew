"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux";

interface AdminRedirectGuardProps {
  children: React.ReactNode;
}

export const AdminRedirectGuard = ({ children }: AdminRedirectGuardProps) => {
  const router = useRouter();
  const { isAuthenticated, isGuest, user } = useAppSelector((state) => state.auth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isAdmin =
      isAuthenticated &&
      !isGuest &&
      user?.permissions?.includes("admin:access");

    if (isAdmin) {
      router.replace("/admin/categories");
      return;
    }

    setIsReady(true);
  }, [isAuthenticated, isGuest, user, router]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4EA674]"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminRedirectGuard;
