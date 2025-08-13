import { Button, Card, Form, Input, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "../features/authSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const { Title, Text } = Typography;

export default function Login() {
  const dispatch = useDispatch();
  const { token, loading } = useSelector((s)=>s.auth);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await dispatch(signin(values)).unwrap();
      message.success("Welcome!");
    } catch (e) {
      message.error(e?.message || "Login failed");
    }
  };

  useEffect(()=>{
    if (token) navigate("/");
  },[token, navigate]);

  return (
    <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
      <Card style={{ width: 360 }}>
        <Title level={4}>Sign in</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Button loading={loading} type="primary" htmlType="submit" block>Sign In</Button>
        </Form>
        <div className="text-center mt-4">
                  <Text>
                    Already have no an account?{' '}
                    <Button type="link" onClick={() => navigate('/signup')} className="p-0">
                      sign up
                    </Button>
                  </Text>
                </div>
      </Card>
    </div>
  );
}
