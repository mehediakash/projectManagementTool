
import { Form, Input, Button, Select, Typography, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, ToolOutlined, TeamOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import { useState } from 'react';

const { Title } = Typography;
const { Option } = Select;

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await authApi.signup(values);
      message.success('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '20px', border: '1px solid #d9d9d9', borderRadius: '2px' }}>
        <Title level={2} style={{ textAlign: 'center' }}>Sign Up</Title>
        <Form
          name="signup"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your Name!', whitespace: true }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { type: 'email', message: 'The input is not valid E-mail!' },
              { required: true, message: 'Please input your E-mail!' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="E-mail" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          {/* <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
          </Form.Item> */}

          <Form.Item
            name="skills"
            rules={[{ required: true, message: 'Please input your skills!' }]}
          >
            <Select mode="tags" style={{ width: '100%' }} placeholder="Skills" prefix={<ToolOutlined />}>
              {/* The user can add their own skills */}
            </Select>
          </Form.Item>

          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select placeholder="Select a role" prefix={<TeamOutlined />}>
              <Option value="admin">Admin</Option>
              <Option value="manager">Project Manager</Option>
              <Option value="member">Member</Option>
              <Option value="viewer">viewer</Option>
            </Select>
          </Form.Item>
          
          {/* <Form.Item
            name="availability"
            rules={[{ required: true, message: 'Please select your availability!' }]}
          >
            <Select placeholder="Select availability" prefix={<CheckCircleOutlined />}>
              <Option value="available">Available</Option>
              <Option value="unavailable">Unavailable</Option>
            </Select>
          </Form.Item> */}

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Signup;
