import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Spin, Alert } from 'antd';
import projectApi from '../api/projectApi';
import taskApi from '../api/taskApi';
import GanttChart from '../components/GanttChart';

const { Title, Paragraph } = Typography;

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      try {
        const projectResponse = await projectApi.getProject(id);
        setProject(projectResponse);
        const tasksResponse = await taskApi.listTasks(id);
        setTasks(tasksResponse);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;
  if (!project) return <Alert message="Project not found" type="warning" showIcon />;

  return (
    <div>
      <Title level={2}>{project.name}</Title>
      <Paragraph>{project.description}</Paragraph>
      <Title level={3}>Gantt Chart</Title>
      <GanttChart tasks={tasks} />
    </div>
  );
};

export default ProjectDetails;
