import { useMemo, useState } from "react";
import { Table, Space, Button, Tag, Popconfirm, Drawer } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, assignTask } from "../../features/taskSlice";
import TaskForm from "./TaskForm";
import PresenceAvatars from "../Presence/PresenceAvatars";
import usePresence from "../Presence/usePresence";
import { UserAddOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function TaskList({ tasks }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [editing, setEditing] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selected, setSelected] = useState(null);

  const canEdit = (task) => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'manager') return true;
    if (user.role === 'member') {
      return task.createdBy?._id === user._id || task.assignees?.some(a => a._id === user._id);
    }
    return false;
  };

  const canDelete = (task) => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'manager') return true;
    if (user.role === 'member') {
      return task.createdBy?._id === user._id;
    }
    return false;
  };

  const columns = useMemo(()=>[
    { title: "Title", dataIndex: "title", key: "title",
      render: (text, record)=>(
        <a onClick={()=>{setSelected(record); setOpenDrawer(true);}}>{text}</a>
      )
    },
    { title: "Project", dataIndex: ["project","name"], key: "project",
      render: (_,r)=> r.project?.name || "—" },
    { title: "Priority", dataIndex: "priority", key: "priority",
      render: (p)=> <Tag color={p<=2?"red":p===3?"gold":"blue"}>P{p}</Tag> },
    { title: "Status", dataIndex: "status", key: "status",
      render: (s)=> <Tag color={s==="done"?"green":s==="blocked"?"volcano":s==="in_progress"?"geekblue":"default"}>{s}</Tag> },
    { title: "Assignees", key:"assignees",
      render: (_,r)=> (r.assignees||[]).map(a=>a.name || a.email).join(", ") || "—" },
    { title: "Actions", key:"actions",
      render: (_,r)=>(
        <Space>
         
          {canEdit(r) && <Button icon={<EditOutlined />} onClick={()=>setEditing(r)} />}
          {canDelete(r) && 
            <Popconfirm title="Delete task?" onConfirm={()=>dispatch(deleteTask(r._id))}>
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          }
        </Space>
      )
    }
  ],[dispatch, user]);

  // presence per selected task drawer
  const { online } = usePresence({ room: selected ? `task:${selected._id}` : "dashboard" });

  return (
    <>
      <Table rowKey="_id" columns={columns} dataSource={tasks} pagination={{ pageSize: 10 }} />

      {/* Edit/Create */}
      <TaskForm open={!!editing} onClose={()=>setEditing(null)} initial={editing} />

      {/* Details drawer */}
      <Drawer width={420} title={selected?.title} open={openDrawer} onClose={()=>setOpenDrawer(false)}>
        <p><b>Project:</b> {selected?.project?.name || "—"}</p>
        <p><b>Status:</b> {selected?.status}</p>
        <p><b>Priority:</b> P{selected?.priority}</p>
        <p><b>Assignees:</b> {(selected?.assignees||[]).map(a=>a.name || a.email).join(", ") || "—"}</p>
        <p><b>Due:</b> {selected?.dueDate ? new Date(selected.dueDate).toLocaleDateString() : "—"}</p>
        <div style={{ marginTop: 16 }}>
          <b>Viewing now:</b> <PresenceAvatars users={online} />
        </div>
      </Drawer>
    </>
  );
}
