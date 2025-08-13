import { useMemo, useState } from "react";
import { Table, Space, Button, Tag, Popconfirm, Drawer, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask } from "../../features/taskSlice";
import TaskForm from "./TaskForm";
import PresenceAvatars from "../Presence/PresenceAvatars";
import usePresence from "../Presence/usePresence";
import { UserAddOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function TaskList({ tasks }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { list: projects } = useSelector(state => state.projects);
  const [editing, setEditing] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

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

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const searchMatch = searchTerm ? 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) : true;

      const projectFilter = filters.project ? filters.project.includes(task.project?._id) : true;
      const statusFilter = filters.status ? filters.status.includes(task.status) : true;
      const priorityFilter = filters.priority ? filters.priority.includes(task.priority) : true;

      return searchMatch && projectFilter && statusFilter && priorityFilter;
    });
  }, [tasks, searchTerm, filters]);

  const columns = useMemo(()=>[
    { title: "Title", dataIndex: "title", key: "title", sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record)=>(
        <a onClick={()=>{setSelected(record); setOpenDrawer(true);}}>{text}</a>
      )
    },
    { title: "Project", dataIndex: ["project","name"], key: "project", 
      filters: projects.map(p => ({ text: p.name, value: p._id })),
      filteredValue: filters.project || null,
      onFilter: (value, record) => record.project?._id === value,
      render: (_,r)=> r.project?.name || "—" 
    },
    { title: "Priority", dataIndex: "priority", key: "priority", sorter: (a, b) => a.priority - b.priority,
      filters: [
        { text: 'High', value: 1 },
        { text: 'Med-High', value: 2 },
        { text: 'Medium', value: 3 },
        { text: 'Low', value: 4 },
        { text: 'Lowest', value: 5 },
      ],
      filteredValue: filters.priority || null,
      onFilter: (value, record) => record.priority === value,
      render: (p)=> <Tag color={p<=2?"red":p===3?"gold":"blue"}>P{p}</Tag> 
    },
    { title: "Status", dataIndex: "status", key: "status",
      filters: [
        { text: 'To Do', value: 'todo' },
        { text: 'In Progress', value: 'in_progress' },
        { text: 'Blocked', value: 'blocked' },
        { text: 'Done', value: 'done' },
      ],
      filteredValue: filters.status || null,
      onFilter: (value, record) => record.status === value,
      render: (s)=> <Tag color={s==="done"?"green":s==="blocked"?"volcano":s==="in_progress"?"geekblue":"default"}>{s}</Tag> 
    },
    { title: "Assignees", key:"assignees",
      render: (_,r)=> (r.assignees||[]).map(a=>a.name || a.email).join(", ") || "—" },
    { title: "Actions", key:"actions",
      render: (_,r)=>(
        <Space>
          {/* {canEdit(r) && <Button icon={<UserAddOutlined />} onClick={()=>setEditing(r)}>Assign/Edit</Button>} */}
          {canEdit(r) && <Button icon={<EditOutlined />} onClick={()=>setEditing(r)} />}
          {canDelete(r) && 
            <Popconfirm title="Delete task?" onConfirm={()=>dispatch(deleteTask(r._id))}>
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          }
        </Space>
      )
    }
  ],[dispatch, user, projects, filters]);

  // presence per selected task drawer
  const { online } = usePresence({ room: selected ? `task:${selected._id}` : "dashboard" });

  const handleTableChange = (pagination, filters) => {
    setFilters(filters);
  };

  return (
    <>
      <Input.Search
        placeholder="Search tasks"
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Table 
        rowKey="_id" 
        columns={columns} 
        dataSource={filteredTasks} 
        pagination={{ pageSize: 10 }} 
        onChange={handleTableChange}
      />

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
