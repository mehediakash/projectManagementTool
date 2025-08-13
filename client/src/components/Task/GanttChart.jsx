import React from "react";
import { Chart } from "react-google-charts";
import dayjs from "dayjs";

export default function GanttChart({ tasks }) {
  const columns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "string", label: "Resource" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];

  const rows = (tasks || []).map((t) => {
    const startDate = t.createdAt ? new Date(t.createdAt) : new Date();
    const endDate = t.dueDate ? new Date(t.dueDate) : dayjs(startDate).add(1, "day").toDate();
    return [
      t._id,
      t.title,
      (t.assignees || []).map(a => a.name || a.email).join(', ') || "Team",
      startDate,
      endDate,
      null, // Duration
      t.status === "done" ? 100 : t.status === "in_progress" ? 50 : 0,
      t.dependencies ? t.dependencies.map(d => d.task).join(",") : null,
    ];
  });

  const data = [columns, ...rows];

  const options = {
    height: rows.length * 40 + 50, // Dynamic height
    gantt: {
      trackHeight: 40,
      barHeight: 20,
      criticalPathEnabled: false,
      labelStyle: { fontName: "Roboto", fontSize: 12, color: "#333" },
      percentEnabled: true,
      shadowEnabled: true,
      defaultStartDate: new Date(),
      palette: [
        { "color": "#5e97f6", "dark": "#2a6acf", "light": "#a7c7f9" }, // Default/in_progress
        { "color": "#db4437", "dark": "#a52714", "light": "#e67c73" }, // Blocked
        { "color": "#0f9d58", "dark": "#0b8043", "light": "#54b382" }  // Done
      ]
    },
  };

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 8, width: '100%' }}>
      {rows.length > 0 ? (
        <Chart chartType="Gantt" width="100%" height="100%" data={data} options={options} />
      ) : (
        <p>No tasks to display in the timeline.</p>
      )}
    </div>
  );
}
