import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, InputNumber, message } from "antd";
import axiosClient from "../../api/axiosClient";
import moment from "moment";
import { useDispatch } from "react-redux";
import { createTask, updateTask } from "../../features/taskSlice";

const { TextArea } = Input;

export default function TaskForm({ visible, onClose, editTask }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [projects, setProjects] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const loadingRef = React.useRef(false);

  useEffect(() => {
    
    axiosClient.get("/projects").then(res => {
    
      setProjects(Array.isArray(res) ? res : (res.rows || []));
    }).catch(() => setProjects([]));

    axiosClient.get("/users").then(res => {
      setUsers(Array.isArray(res) ? res : (res.rows || []));
    }).catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    if (editTask) {
      form.setFieldsValue({
        title: editTask.title,
        description: editTask.description,
        project: editTask.project?._id || editTask.project,
        priority: editTask.priority || 3,
        dueDate: editTask.dueDate ? moment(editTask.dueDate) : null,
        assignees: (editTask.assignees || []).map(a => (a._id ? a._id : a))
      });
    } else {
      form.resetFields();
    }
  }, [editTask, form]);

  const onFinish = async (vals) => {
    try {
      loadingRef.current = true;
      const payload = {
        title: vals.title,
        description: vals.description,
        project: vals.project,
        priority: vals.priority,
        dueDate: vals.dueDate ? vals.dueDate.toDate() : null,
        assignees: vals.assignees || []
      };

      if (editTask) {
        await dispatch(updateTask({ id: editTask._id, data: payload })).unwrap();
        message.success("Task updated");
      } else {
        await dispatch(createTask(payload)).unwrap();
        message.success("Task created");
      }
      onClose();
    } catch (err) {
      message.error(err.message || "Operation failed");
    } finally {
      loadingRef.current = false;
    }
  };

  return (
    <Modal
      visible={visible}
      title={editTask ? "Edit Task" : "Create Task"}
      okText={editTask ? "Update" : "Create"}
      onCancel={onClose}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="project" label="Project">
          <Select showSearch optionFilterProp="children" allowClear>
            {projects.map(p => <Select.Option key={p._id} value={p._id}>{p.name}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="assignees" label="Assignees">
          <Select mode="multiple" allowClear>
            {users.map(u => <Select.Option key={u._id} value={u._id}>{u.name} ({u.role})</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="priority" label="Priority" initialValue={3}>
          <InputNumber min={1} max={5} />
        </Form.Item>
        <Form.Item name="dueDate" label="Due date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
