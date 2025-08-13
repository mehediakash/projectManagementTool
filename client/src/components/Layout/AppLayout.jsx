import { Layout, Dropdown, Space, message } from "antd";
import SidebarMenu from "./SidebarMenu";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";

const { Header, Sider, Content } = Layout;

export default function AppLayout() {
  const { user } = useSelector((s)=>s.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    { key: "profile", label: user ? user.name : "Guest" },
    { key: "logout", label: "Logout" },
  ];

  const onClick = ({ key }) => {
    if (key === "logout") {
      dispatch(logout());
      message.success("Logged out");
      navigate("/login");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsible>
        <div style={{ color: "#fff", padding: 16, fontWeight: 600 }}>PM Tool</div>
        <SidebarMenu />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: "0 16px", display: "flex", justifyContent: "flex-end" }}>
          <Dropdown menu={{ items: menuItems, onClick }}>
            <Space style={{ cursor: "pointer" }}>{user ? user.email : "Login"}</Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: 16, background: "#fff", padding: 16, borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
