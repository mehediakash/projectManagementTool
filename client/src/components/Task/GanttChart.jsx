import React, { useEffect, useRef, useState } from "react";
import Gantt from "frappe-gantt";
import axios from "axios";

export default function GanttChart() {
  const ganttRef = useRef(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get("/api/tasks")
      .then((res) => {
        const formatted = res.data.map((task) => ({
          id: task._id,
          name: task.title,
          start: task.startDate,
          end: task.endDate,
          progress: task.progress || 0,
        }));
        setTasks(formatted);
      })
      .catch(() => console.error("Failed to load Gantt tasks"));
  }, []);

  useEffect(() => {
    if (tasks.length > 0 && ganttRef.current) {
      new Gantt(ganttRef.current, tasks, {
        view_mode: "Day",
        date_format: "YYYY-MM-DD",
      });
    }
  }, [tasks]);

  return <div ref={ganttRef}></div>;
}
