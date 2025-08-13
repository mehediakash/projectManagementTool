import { Menu } from "antd";
import { AppstoreOutlined, LoginOutlined, ProjectOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import RoleGuard from "../RoleGuard";

export default function SidebarMenu() {
  const { pathname } = useLocation();
  const { token } = useSelector((s)=>s.auth);
  return (
    <Menu theme="dark" mode="inline" selectedKeys={[pathname]}>
      <Menu.Item key="/" icon={<AppstoreOutlined />}>
        <Link to="/">Dashboard</Link>
      </Menu.Item>
      <RoleGuard allow={["admin", "manager"]}>
        <Menu.Item key="/projects" icon={<ProjectOutlined />}>
          <Link to="/projects">Projects</Link>
        </Menu.Item>
      </RoleGuard>
      {!token && (
        <Menu.Item key="/login" icon={<LoginOutlined />}>
          <Link to="/login">Login</Link>
        </Menu.Item>
      )}
    </Menu>
  );
}
