import React from 'react';
import './job.css';
import Search from '@/components/Search';
import { Header, Footer } from '@/layout';
import Post from '@/components/JobPost/Post';
import Filter from '@/components/Filter';
import projectServices from '@/services/projectPostServices';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { NewProject } from '../Project/';

const Job = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const projectsData = await projectServices.getAllProjects();
      setProjects(projectsData.data);
      console.log('data', projectsData.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleNewProject = () => {
    setIsOpen(true);
  };

  

  const [isChange, setIsChange] = useState(false);

  return (
    <>
      {isOpen && <NewProject isOpen={isOpen} onClose={() => setIsOpen(false)} onUpdate = {() => {setIsChange(true)}} />}

      <div className="job-page">
        <div className="content">
          <div className="containerp">
            <div className="topbar">
              <div className="button">
                <button className="btn-new-post" onClick={handleNewProject}>
                  + New Post
                </button>
              </div>
              <Search />
              <select className="sort">
                <option value="" disabled defaultValue>
                  Sort
                </option>
                <option value="price">Price</option>
                <option value="review">Review</option>
              </select>
            </div>
          </div>
        </div>

        <div className="c-container">
          <div className="left-job">
            <Filter />
          </div>
          <div className="right-job">
            {projects.map((project) => (
              <Post
                key={project.id}
                projectId={project.id}
                projectTitle={project.title}
                projectTagsId={project.tag_id}
                projectDetail={project.detail}
                projectBudget={[project.budget_min, project.budget_max]}
                userID={project.user_id}
                handleBidClick={() => {
                  console.log('navigate to project detail page');

                  navigate(`/project/${project.id}`);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Job;
