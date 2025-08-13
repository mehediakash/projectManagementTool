import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../features/userSlice';

const { Option } = Select;

const EditProjectModal = ({ visible, onCancel, onFinish, initialData }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { list: users, loading } = useSelector(state => state.users);

  useEffect(() => {
    if (visible) {
      dispatch(fetchUsers());
      form.setFieldsValue(initialData);
    }
  }, [dispatch, visible, initialData, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        onFinish(values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Edit Project"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          Update
        </Button>,
      ]}
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
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="members" label="Members">
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Please select members"
            loading={loading}
          >
            {users.map(user => (
              <Option key={user._id} value={user._id}>{user.name}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProjectModal;
