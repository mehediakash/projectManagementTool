import React, { useEffect } from "react";
import { Table, Button, Space, Popconfirm, Tag, Select, message, Badge } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask, assignTask } from "../../features/taskSlice";
import TaskForm from "./TaskForm";
import axiosClient from "../../api/axiosClient";
import io from "socket.io-client";

export default function TaskList() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.tasks);
  const user = useSelector(s => s.auth.user);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editTask, setEditTask] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [presence, setPresence] = React.useState({});

  useEffect(() => {
    dispatch(fetchTasks());
    
    axiosClient.get("/users").then(res => setUsers(Array.isArray(res) ? res : (res.rows || []))).catch(() => setUsers([]));


    const token = localStorage.getItem("token");
  
    const socket = io("http://localhost:4000", { query: { userId: user?._id || "" }, transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("socket connected", socket.id);
    });

    socket.on("notification", (notif) => {
      message.info(notif.payload?.title || "Notification");
    });

    socket.on("presence", (payload) => {
     
      setPresence(prev => ({ ...prev, [payload.taskId]: payload.count }));
    });

    return () => { socket.disconnect(); };
  }, [dispatch, user]);

  const onDelete = async (id) => {
    try {
      await dispatch(deleteTask(id)).unwrap();
      message.success("Deleted");
    } catch (err) {
      message.error(err.message || "Delete failed");
    }
  };

  const onEdit = (task) => {
    setEditTask(task);
    setModalVisible(true);
  };

  const onAssign = async (taskId, assigneeId) => {
    try {
      await dispatch(assignTask({ id: taskId, assigneeId })).unwrap();
      message.success("Assigned");
    } catch (err) {
      message.error(err.message || "Assign failed");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div style={{ marginTop: 6 }}>
            {record.priority && <Tag color="magenta">P{record.priority}</Tag>}
            {record.status && <Tag>{record.status}</Tag>}
            {presence[record._id] ? <Badge count={presence[record._id]} style={{ backgroundColor: '#52c41a' }} /> : null}
          </div>
        </div>
      )
    },
    {
      title: "Project",
      dataIndex: "project",
      key: "project",
      render: (p) => p?.name || "-"
    },
    {
      title: "Assignees",
      dataIndex: "assignees",
      key: "assignees",
      render: (arr) => (arr && arr.length ? arr.map(a => <Tag key={typeof a === "string" ? a : a._id}>{a.name || a}</Tag>) : "-")
    },
    {
      title: "Due",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (d) => d ? new Date(d).toLocaleDateString() : "-"
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, rec) => {
        const allowedEdit = ["admin", "manager", "member"].includes(user?.role);
        const allowedDelete = ["admin", "manager"].includes(user?.role);
        return (
          <Space>
            {allowedEdit && <Button size="small" onClick={() => onEdit(rec)}>Edit</Button>}
            {allowedDelete && (
              <Popconfirm title="Delete?" onConfirm={() => onDelete(rec._id)}>
                <Button size="small" danger>Delete</Button>
              </Popconfirm>
            )}
            {["admin", "manager"].includes(user?.role) && (
              <Select
                placeholder="Assign"
                style={{ width: 150 }}
                onSelect={(val) => onAssign(rec._id, val)}
                value={undefined}
                size="small"
              >
                {users.map(u => <Select.Option key={u._id} value={u._id}>{u.name} ({u.role})</Select.Option>)}
              </Select>
            )}
          </Space>
        );
      }
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={() => { setEditTask(null); setModalVisible(true); }}>Create Task</Button>
      </div>

      <Table
        columns={columns}
        dataSource={list}
        rowKey={(r) => r._id}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {modalVisible && (
        <TaskForm visible={modalVisible} onClose={() => setModalVisible(false)} editTask={editTask} />
      )}
    </div>
  );
}
