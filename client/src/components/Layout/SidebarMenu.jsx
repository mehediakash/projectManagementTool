import { Menu } from "antd";
import { DashboardOutlined, LoginOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function SidebarMenu() {
  return (
    <Menu theme="dark" mode="inline">
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
        <Link to="/">Dashboard</Link>
      </Menu.Item>
      <Menu.Item key="login" icon={<LoginOutlined />}>
        <Link to="/login">Login</Link>
      </Menu.Item>
    </Menu>
  );
}
