import React from "react";
import { Chart } from "react-google-charts";
import dayjs from "dayjs";

export default function GanttChart({ tasks }) {
  const data = [
    [
      { type: "string", label: "Task ID" },
      { type: "string", label: "Task Name" },
      { type: "string", label: "Resource" },
      { type: "date", label: "Start Date" },
      { type: "date", label: "End Date" },
      { type: "number", label: "Duration" },
      { type: "number", label: "Percent Complete" },
      { type: "string", label: "Dependencies" },
    ],
    ...(tasks || []).map((t) => [
      t._id,
      t.title,
      (t.assignees || []).map(a => a.name || a.email).join(', ') || "Team",
      t.createdAt ? new Date(t.createdAt) : new Date(),
      t.dueDate ? new Date(t.dueDate) : dayjs().add(3, "day").toDate(),
      null,
      t.status === "done" ? 100 : t.status === "in_progress" ? 50 : 0,
      t.dependencies ? t.dependencies.join(",") : null,
    ]),
  ];

  const options = {
    height: 400,
    gantt: {
      trackHeight: 30,
      barHeight: 20,
      criticalPathEnabled: false,
      labelStyle: { fontName: "Arial", fontSize: 12, color: "#333" },
    },
  };

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 8 }}>
      <Chart chartType="Gantt" width="100%" height="400px" data={data} options={options} />
    </div>
  );
}
