import { Layout, Button } from "antd";
import SidebarMenu from "./SidebarMenu";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";

const { Header, Sider, Content } = Layout;

export default function AppLayout() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <SidebarMenu />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>Task Management Dashboard</div>
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Header>
        <Content style={{ margin: "16px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
