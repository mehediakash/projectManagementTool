import { useEffect } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Radio } from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { createTask, updateTask } from "../../features/taskSlice";
import { fetchProjects } from "../../features/projectSlice";
import { fetchUsers } from "../../features/userSlice";

export default function TaskForm({ open, onClose, initial }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { list: projects } = useSelector((s)=>s.projects);
  const { list: users } = useSelector((s)=>s.users);
  const { list: tasks } = useSelector((s)=>s.tasks);
  const [form] = Form.useForm();

  const isMemberEditingAssignedTask = user.role === 'member' && initial && initial.createdBy?._id !== user._id && initial.assignees?.some(a => a._id === user._id);

  useEffect(()=>{ 
    dispatch(fetchProjects());
    dispatch(fetchUsers());
  },[dispatch]);

  useEffect(()=>{
    if (initial) {
      form.setFieldsValue({
        title: initial.title,
        description: initial.description,
        project: initial.project?._id || initial.project,
        assignees: (initial.assignees||[]).map(a => a._id || a),
        priority: initial.priority || 3,
        status: initial.status || "todo",
        dueDate: initial.dueDate ? dayjs(initial.dueDate) : null,
        dependencies: (initial.dependencies||[]).map(d => d.task?._id || d.task),
      });
    } else {
      form.resetFields();
    }
  },[initial, form]);

  const onFinish = (values) => {
    const payload = {
      ...values,
      dueDate: values.dueDate ? values.dueDate.toISOString() : null
    };
    if (initial?._id) {
      dispatch(updateTask({ id: initial._id, data: payload }));
    } else {
      dispatch(createTask(payload));
    }
    onClose();
  };

  return (
    <Modal open={open} onCancel={onClose} title={initial? "Edit Task" : "New Task"} footer={null} destroyOnClose>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title required" }]}>
          <Input placeholder="Task title" disabled={isMemberEditingAssignedTask} />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Details" disabled={isMemberEditingAssignedTask} />
        </Form.Item>
        <Form.Item name="project" label="Project" rules={[{ required: true }]}>
          <Select placeholder="Select project" options={projects.map(p=>({label:p.name, value:p._id}))} disabled={isMemberEditingAssignedTask} />
        </Form.Item>
        <Form.Item name="assignees" label="Assignees">
          <Select mode="multiple" placeholder="Select assignees"
            options={users.map(u=>({label:`${u.name} (${u.email})`, value:u._id}))} disabled={isMemberEditingAssignedTask} />
        </Form.Item>
        <Form.Item name="priority" label="Priority">
          <Radio.Group disabled={isMemberEditingAssignedTask}>
            <Radio value={1}>High</Radio>
            <Radio value={2}>Med-High</Radio>
            <Radio value={3}>Medium</Radio>
            <Radio value={4}>Low</Radio>
            <Radio value={5}>Lowest</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select
            options={[
              { label:"To Do", value:"todo" },
              { label:"In Progress", value:"in_progress" },
              { label:"Blocked", value:"blocked" },
              { label:"Done", value:"done" },
            ]}
          />
        </Form.Item>
        <Form.Item name="dueDate" label="Due Date">
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item name="dependencies" label="Dependencies">
          <Select
            mode="multiple"
            placeholder="Select tasks this one depends on"
            options={tasks.map(t=>({label:t.title, value:t._id}))}
            disabled={isMemberEditingAssignedTask}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {initial? "Update Task" : "Create Task"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
