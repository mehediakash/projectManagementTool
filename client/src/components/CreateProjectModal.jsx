import { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import userApi from '../api/userApi';

const { Option } = Select;

const CreateProjectModal = ({ visible, onCancel, onFinish }) => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      const fetchUsers = async () => {
        try {
          const response = await userApi.listUsers();
          setUsers(response);
        } catch (error) {
          console.error('Failed to fetch users:', error);
        }
      };
      fetchUsers();
    }
  }, [visible]);

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields();
        onFinish(values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      visible={visible}
      title="Create a new project"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="name"
          label="Project Name"
          rules={[{ required: true, message: 'Please input the name of the project!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="members" label="Members">
          <Select mode="multiple" placeholder="Please select members">
            {users.map(user => (
              <Option key={user._id} value={user._id}>
                {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProjectModal;
