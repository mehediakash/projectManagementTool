import { Button, Flex, Typography } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { fetchTasks, fetchAllTasks } from "../features/taskSlice";
import { fetchProjects } from "../features/projectSlice";
import TaskList from "../components/Task/TaskList";
import TaskForm from "../components/Task/TaskForm";
import GanttChart from "../components/Task/GanttChart";
import RoleGuard from "../components/RoleGuard";

const { Title } = Typography;

export default function Dashboard() {
  const dispatch = useDispatch();
  const { list: tasks, allTasks, loading } = useSelector((s)=>s.tasks);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(()=>{
    dispatch(fetchProjects());
    dispatch(fetchTasks());
    dispatch(fetchAllTasks());
  }, [dispatch]);

  const actions = useMemo(()=>(
    <Flex gap={8} wrap>
      <Button icon={<ReloadOutlined />} onClick={()=>dispatch(fetchTasks())}>Refresh</Button>
      <RoleGuard allow={["admin","manager","member"]}>
        <Button type="primary" icon={<PlusOutlined />} onClick={()=>setCreateOpen(true)}>
          New Task
        </Button>
      </RoleGuard>
    </Flex>
  ),[dispatch]);

  return (
    <div>
      <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
        <Title level={3} style={{ margin: 0 }}>Task Management</Title>
        {actions}
      </Flex>

      <TaskList tasks={tasks} loading={loading} />

      <Title level={4} style={{ marginTop: 24 }}>Project Timeline</Title>
      <GanttChart tasks={allTasks} />

      <TaskForm open={createOpen} onClose={()=>setCreateOpen(false)} />
    </div>
  );
}
