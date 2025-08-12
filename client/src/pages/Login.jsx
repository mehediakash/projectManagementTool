import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice";
import { Form, Input, Button, Card, Alert } from "antd";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(s => s.auth);

  const onFinish = async (values) => {
    const result = await dispatch(loginUser(values));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "80vh", alignItems: "center", justifyContent: "center" }}>
      <Card title="Sign in" style={{ width: 380 }}>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 12 }} />}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter email" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter password" }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>Sign in</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
