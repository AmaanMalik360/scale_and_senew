"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/app/redux";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export const AuthGuard = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo,
}: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isGuest, user } = useAppSelector(
    (state) => state.auth
  );
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (requireAuth && !isAuthenticated) {
        const redirect = redirectTo || (requireAdmin ? "/admin/login" : "/signin");
        router.push(`${redirect}?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (requireAuth && requireAdmin && isGuest) {
        router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (requireAdmin && user?.permissions) {
        const hasAdminAccess = user.permissions.includes("admin:access");
        if (!hasAdminAccess) {
          router.push("/admin/login?error=unauthorized");
          return;
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [
    isAuthenticated,
    isGuest,
    user,
    requireAuth,
    requireAdmin,
    redirectTo,
    router,
    pathname,
  ]);

  if (isChecking && requireAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
