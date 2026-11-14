import type { ReactNode } from "react";
import { Redirect } from "expo-router";
import { useAppSelector, selectIsAdmin } from "@/store";

interface AdminGuardProps {
  children: ReactNode;
}

/**
 * AdminGuard enforces client-side role scoping for administrative routes.
 *
 * NOTE: Client-side routing guards provide user-experience boundaries and prevent
 * accidental navigation, but they do NOT constitute true server-side security.
 * In production, the backend API must validate authentication tokens and enforce
 * role-based access control (RBAC) on every administrative endpoint and mutation.
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  const isAdmin = useAppSelector(selectIsAdmin);

  if (!isAdmin) {
    return <Redirect href="/" />;
  }

  return <>{children}</>;
}

