import { useEffect } from "react";
import { useDispatch } from "react-redux";
import TaskList from "../components/Task/TaskList";
import { fetchTasks } from "../features/taskSlice";
import { Card } from "antd";

export default function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <h2>Overview</h2>
        <p>Realtime task presence & notifications enabled</p>
      </Card>

      <Card>
        <TaskList />
      </Card>
    </div>
  );
}
