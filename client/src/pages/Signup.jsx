import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Slider, 
  Card, 
  Typography, 
  Alert, 
  Spin,
  Divider 
} from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

export default function Signup() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...values,
        skills: values.skills ? values.skills.split(',').map(skill => skill.trim()) : [],
      };
      await axiosClient.post('/auth/signup', payload);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <Title level={3}>Create Your Account</Title>
          <Text type="secondary">Join our community today</Text>
        </div>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            role: 'member',
            availability: 1
          }}
        >
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              className="mb-4"
            />
          )}

          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="John Doe" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="john@example.com" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="••••••••" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
          >
            <Select size="large">
              <Option value="member">Member</Option>
              <Option value="manager">Manager</Option>
              <Option value="admin">Admin</Option>
              <Option value="viewer">Viewer</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="skills"
            label="Skills"
            tooltip="Separate multiple skills with commas"
          >
            <Input 
              placeholder="e.g. JavaScript, React, Node.js" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="availability"
            label={`Availability: ${form.getFieldValue('availability') || 1} hours/day`}
          >
            <Slider 
              min={0} 
              max={8} 
              marks={{
                0: '0h',
                4: '4h',
                8: '8h'
              }}
              tooltip={{ formatter: value => `${value}h/day` }}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4">
          <Text>
            Already have an account?{' '}
            <Button type="link" onClick={() => navigate('/login')} className="p-0">
              Log in
            </Button>
          </Text>
        </div>
      </Card>
    </div>
  );
}