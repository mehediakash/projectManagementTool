import React from "react";
import { useSelector } from "react-redux";

/**
 * Usage:
 * <RoleGuard allow={['admin','manager']}>
 *   <Button>Only Admin/Manager</Button>
 * </RoleGuard>
 */
export default function RoleGuard({ allow = [], children, fallback = null }) {
  const { user } = useSelector((s)=>s.auth);
  if (!user) return fallback;
  if (allow.length === 0 || allow.includes(user.role)) return <>{children}</>;
  return fallback;
}
