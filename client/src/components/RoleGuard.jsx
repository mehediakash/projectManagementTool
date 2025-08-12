import React from "react";
import { useSelector } from "react-redux";
import { Result } from "antd";

/**
 * <RoleGuard roles={['admin','manager']}> ...children... </RoleGuard>
 */
export default function RoleGuard({ roles = [], children }) {
  const user = useSelector((s) => s.auth.user);

  if (!user) {
    return <Result status="403" title="Access Denied" subTitle="You need to login to view this page." />;
  }

  if (roles.length && !roles.includes(user.role)) {
    return <Result status="403" title="Forbidden" subTitle="You don't have permission to access this area." />;
  }

  return <>{children}</>;
}
