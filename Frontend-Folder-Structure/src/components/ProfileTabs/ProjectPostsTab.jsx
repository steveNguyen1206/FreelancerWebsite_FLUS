import React from 'react';
import './ProjectPostsTab.css';
import Post from '@/components/JobPost/Post';
import projectPostServices from '@/services/projectPostServices';
import reviewServices from '@/services/reviewServices';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const ProjectPostsTab = ({ userId }) => {
  // console.log('ProjectPostsTab userId: ', userId);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const fetchProjects = async (userId) => {
    // console.log('fetching projects: ' + userId);

    if (!userId) return;

    try {
      // console.log('userId', userId);
      const projectsData = await projectPostServices.getAllByUserId(userId);

      console.log('projectsData', projectsData);

      setProjects(projectsData.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects(userId);
  }, [userId]);

  return (
    <div className="project-posts-container">
      {projects.map((project) => (
        <Post
          key={project.id}
          project={project}
          handleBidClick={() => {
            console.log('navigate to project detail page');
            navigate(`/project/${project.id}`);
          }}
        />
      ))}
    </div>
  );
};

export default ProjectPostsTab;
