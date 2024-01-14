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

      const projectsWithRating = await Promise.all(
        projectsData.data.map(async (project) => {
          const ownerRatingData = await reviewServices.getRatingClient(
            project.user_id
          );
          return {
            ...project,
            owner: {
              averageStar: ownerRatingData.data.averageStar,
            },
          };
        })
      );
      setProjects(projectsWithRating);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects(userId);
  }, [userId]);

  return (
    <div className='project-posts-container'>
      {projects.map((project) => (
        <Post
          key={project.id}
          projectId={project.id}
          projectTitle={project.title}
          projectTagsId={project.tag_id}
          projectDetail={project.detail}
          ownerRating={project.owner.averageStar}
          projectBudget={[project.budget_min, project.budget_max]}
          userID={project.user_id}
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
