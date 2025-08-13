import React, { useState } from 'react';
import { Card, Avatar, Tooltip, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { deleteProject, updateProject } from '../features/projectSlice';
import RoleGuard from './RoleGuard';
import EditProjectModal from './EditProjectModal';

const { Meta } = Card;

const ProjectCard = ({ project }) => {
  const dispatch = useDispatch();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleDelete = () => {
    dispatch(deleteProject(project._id))
      .unwrap()
      .then(() => {
        message.success('Project deleted successfully');
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const handleEdit = (values) => {
    dispatch(updateProject({ id: project._id, data: values }))
      .unwrap()
      .then(() => {
        message.success('Project updated successfully');
        setIsEditModalVisible(false);
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const actions = [
    <RoleGuard allow={['admin', 'manager']}>
      <Tooltip title="Edit Project">
        <Button shape="circle" icon={<EditOutlined />} onClick={() => setIsEditModalVisible(true)} />
      </Tooltip>
    </RoleGuard>,
    <RoleGuard allow={['admin']}>
      <Popconfirm
        title="Are you sure you want to delete this project?"
        onConfirm={handleDelete}
        okText="Yes"
        cancelText="No"
      >
        <Tooltip title="Delete Project">
          <Button danger shape="circle" icon={<DeleteOutlined />} />
        </Tooltip>
      </Popconfirm>
    </RoleGuard>,
  ];

  return (
    <>
      <Card
        style={{ width: 300, marginTop: 16 }}
        actions={actions}
      >
        <Meta
          avatar={<Avatar src={`https://i.pravatar.cc/150?u=${project._id}`} />}
          title={project.name}
          description={project.description}
        />
        <div style={{ marginTop: '16px' }}>
          <p>Owner: {project.owner?.name || 'N/A'}</p>
          <div>
            <span>Members: </span>
            {(project.members || []).map(member => (
              <Tooltip title={member.name} key={member._id}>
                <Avatar icon={<UserOutlined />} />
              </Tooltip>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'grey', marginTop: '16px' }}>
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
      </Card>
      <EditProjectModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onFinish={handleEdit}
        initialData={project}
      />
    </>
  );
};

export default ProjectCard;
