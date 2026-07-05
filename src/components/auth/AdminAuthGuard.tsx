"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const router = useRouter();
  const { isAuthenticated, isGuest, user } = useAppSelector(
    (state) => state.auth
  );
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated) {
        router.push("/admin/login");
        return;
      }

      if (isGuest) {
        router.push("/admin/login");
        return;
      }

      if (user?.permissions) {
        const hasAdminAccess = user.permissions.includes("admin:access");
        if (!hasAdminAccess) {
          router.push("/admin/login?error=unauthorized");
          return;
        }
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [isAuthenticated, isGuest, user, router]);

  if (!isAuthorized) {
    return (
      <div className="admin-panel flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4EA674]"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
