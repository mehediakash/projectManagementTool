import { useEffect, useRef } from 'react';
import Gantt from 'frappe-gantt';

const GanttChart = ({ tasks }) => {
  const ganttRef = useRef(null);

  const transformTasksForGantt = (tasks) => {
    return tasks.map(task => ({
      id: task._id,
      name: task.title,
      start: task.createdAt, // Using createdAt as start date
      end: task.dueDate,
      progress: task.status === 'done' ? 100 : (task.status === 'in_progress' ? 50 : 0),
      dependencies: task.dependencies.map(dep => dep.task).join(', ')
    }));
  };

  useEffect(() => {
    if (ganttRef.current && tasks.length > 0) {
      const ganttTasks = transformTasksForGantt(tasks);
      new Gantt(ganttRef.current, ganttTasks, {
        header_height: 50,
        column_width: 30,
        step: 24,
        view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
        bar_height: 20,
        bar_corner_radius: 3,
        arrow_curve: 5,
        padding: 18,
        view_mode: 'Week',
        date_format: 'YYYY-MM-DD',
        language: 'en',
        custom_popup_html: null
      });
    }
  }, [tasks]);

  return <div ref={ganttRef}></div>;
};

export default GanttChart;
