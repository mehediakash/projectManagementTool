import { Card } from 'antd';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <Link to={`/projects/${project._id}`}>
      <Card hoverable title={project.name}>
        <p>{project.description}</p>
      </Card>
    </Link>
  );
};

export default ProjectCard;
