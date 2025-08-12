import React from 'react';
import { Bar } from '@ant-design/plots';

const data = [
  { task: 'Task 1', start: '2025-08-10', end: '2025-08-13' },
  { task: 'Task 2', start: '2025-08-11', end: '2025-08-14' },
];

export default function GanttLikeChart() {
  const config = {
    data: data.map(d => ({
      task: d.task,
      duration: [new Date(d.start).getTime(), new Date(d.end).getTime()]
    })),
    xField: 'duration',
    yField: 'task',
    isRange: true,
  };

  return <Bar {...config} />;
}
