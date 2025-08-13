import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Typography, Spin, Alert, Row, Col, message } from 'antd';
import { fetchProjects, createProject } from '../features/projectSlice';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';

const { Title } = Typography;

const Projects = () => {
  const dispatch = useDispatch();
  const { list: projects, loading, error } = useSelector(state => state.projects);
  const user = useSelector(state => state.auth.user);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateProject = async (values) => {
    try {
      await dispatch(createProject(values)).unwrap();
      message.success('Project created successfully!');
      setIsModalVisible(false);
    } catch (error) {
      message.error(error.message);
    }
  };

  const canCreateProject = user && (user.role === 'admin' || user.role === 'manager');

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>Projects</Title>
        {canCreateProject && (
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Create Project
          </Button>
        )}
      </div>
      <Row gutter={[16, 16]}>
        {projects.map(project => (
          <Col xs={24} sm={12} md={8} lg={6} key={project._id}>
            <ProjectCard project={project} />
          </Col>
        ))}
      </Row>
      <CreateProjectModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onFinish={handleCreateProject}
      />
    </div>
  );
};

export default Projects;
