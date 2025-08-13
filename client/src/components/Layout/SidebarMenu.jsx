import { Menu, Spin } from "antd";
import { DashboardOutlined, ProjectOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    path: '/',
    roles: ['admin', 'manager', 'member'],
  },
  {
    key: 'projects',
    icon: <ProjectOutlined />,
    label: 'Projects',
    path: '/projects',
    roles: ['admin', 'manager', 'member'],
  },
  {
    key: 'admin',
    icon: <UserOutlined />,
    label: 'Admin',
    path: '/admin',
    roles: ['admin'],
  },
  {
    key: 'manager',
    icon: <TeamOutlined />,
    label: 'Manager',
    path: '/manager',
    roles: ['admin', 'manager'],
  }
];

export default function SidebarMenu() {
  const { user, isUserLoading } = useSelector(state => state.auth);

  if (isUserLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin /></div>;
  }

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roles) return true; // public routes
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  return (
    <Menu theme="dark" mode="inline">
      {filteredMenuItems.map(item => (
        <Menu.Item key={item.key} icon={item.icon}>
          <Link to={item.path}>{item.label}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );
}
