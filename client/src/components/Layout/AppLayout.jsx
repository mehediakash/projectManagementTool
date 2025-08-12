import { Layout } from "antd";
import SidebarMenu from "./SidebarMenu";
import { Outlet } from "react-router-dom";

const { Header, Sider, Content } = Layout;

export default function AppLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <SidebarMenu />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff" }}>Task Management Dashboard</Header>
        <Content style={{ margin: "16px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
