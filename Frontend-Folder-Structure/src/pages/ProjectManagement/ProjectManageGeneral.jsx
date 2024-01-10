import React from 'react';
import { TextContainer } from '@/components/container';
import './style.css';
import {
  ProjectContent,
  ProjectConfigure,
  ProjectReport,
  ProjectReportJudging,
  ProjectNotification,
  ProjectComplaint,
} from '.';
import { createContext, useContext, useState } from 'react';
import { useProjectManageContext } from './ProjectManageProvider';
import { useEffect } from 'react';
import projectService from '@/services/projectServices';



export const ProjectManageGeneral = () => {
  const { project, setProject, isOwn, projectTab, setProjectTab } =
    useProjectManageContext();
  const [error, setError] = useState(null);
  const [allProject, setAllProject] = useState([]);

  const getMemberProject = (projectId) => {
    projectService
      .findMemberOnebyId(projectId, localStorage.getItem('AUTH_TOKEN'))
      .then((response) => {
        setProject(response.data);
        console.log(response.data);
        // console.log("test", isOwn);
      })
      .catch((e) => {
        setError(e.response.data.message);
        // console.log(e.response.data.message);
        console.log(e);
      });
  };

  const getOwnerProject = (projectId) => {
    projectService
      .findOwnerOnebyId(projectId, localStorage.getItem('AUTH_TOKEN'))
      .then((response) => {
        setProject(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
        setError(e.response.data.message);
      });
  };

  const getAllProject = () => {
    if(isOwn)
    {
      projectService
      .getAllOwnProjects(localStorage.getItem('AUTH_TOKEN'))
      .then((response) => {
        setAllProject(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
        setError(e.response.data.message);
      });
    }
    else
    {
      projectService
      .getAllMemberProjects(localStorage.getItem('AUTH_TOKEN'))
      .then((response) => {
        setAllProject(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
        setError(e.response.data.message);
      });
    }
  };

  useEffect(() => {
    if (project.id) {
      if (isOwn) getOwnerProject(project.id);
      else getMemberProject(project.id);
    }
    getAllProject();
    console.log(error);
  }, []);

  return (
    <div className="qun-l-d-n">
      <div className="tm-d-n">
        <div className="title-wrapper">
          <h5 className="title-text --color-green --size-20">My projects</h5>
        </div>

        <form className="gr-search">
          <input className="label-text" type="text" placeholder="Search" />
          <img
            className="search-icon"
            src="https://c.animaapp.com/6LZYVBLH/img/search-icon-1.svg"
          />
        </form>

        <div className="gr-findskill">
          <div className="fillter-wrapper --background-green-accent">
            <div className="value-text--color-green  --color-white --size-16">
              All
            </div>
          </div>

          <div className="fillter-wrapper --background-white ">
            <div className="value-text --color-green --size-16">Completed</div>
          </div>

          <div className="fillter-wrapper --background-white">
            <div className="value-text --color-green --size-16">Canceled</div>
          </div>
        </div>

        <div className="all-project-container">
          
            {allProject.map((project) => (
              <div className="all-project-item {--background-gradient}" style={{marginTop: '16px'}}>
                <div className="project-img" />
                <h4 className="title-text --size-16">{project.project_name}</h4>
              </div>
            ))}
        </div>

      </div>

      <div className="frame">
        <div className="project-title-container">
          <h2 className="title-text --size-28 --color-white">
            {project.status == 0 ? 'Confiugre Project' : project.project_name}
          </h2>
        </div>
        <div className="function-text-wraper">
          <h4
            className={
              projectTab == 'general'
                ? 'function-text --color-green'
                : 'function-text'
            }
            onClick={() => setProjectTab('general')}
          >
            General
          </h4>
          <h4
            className={
              projectTab == 'report'
                ? 'function-text --color-green'
                : 'function-text'
            }
            onClick={() => setProjectTab('report')}
            disabled={project.status == 0}
          >
            Report
          </h4>
          <h4
            className={
              projectTab == 'notification'
                ? 'function-text --color-green'
                : 'function-text'
            }
            onClick={() => setProjectTab('notification')}
          >
            Notification
          </h4>
          <h4
            className={
              projectTab == 'complaint'
                ? 'function-text --color-green'
                : 'function-text'
            }
            onClick={() => setProjectTab('complaint')}
          >
            Complaint
          </h4>
          <h4
            className={
              projectTab == 'review'
                ? 'function-text --color-green'
                : 'function-text'
            }
            onClick={() => setProjectTab('review')}
          >
            Review
          </h4>
        </div>

        {error && <>{error}</>}
        {error == null &&
          project.status == 0 &&
          projectTab != 'notification' &&
          (isOwn ? (
            <ProjectConfigure />
          ) : (
            <>
              Project is under config. Contact your client for more infomation
            </>
          ))}

        {error == null &&
          (project.status == 1 ||
            project.status == 2 ||
            project.status == 3 ||
            project.status == 4) &&
          projectTab == 'general' && <ProjectContent />}
        {error == null &&
          (project.status == 1 ||
            project.status == 2 ||
            project.status == 3 ||
            project.status == 4) &&
          projectTab == 'report' &&
          (isOwn ? <ProjectReportJudging /> : <ProjectReport />)}

        {error == null &&
          (project.status == 1 ||
            project.status == 2 ||
            project.status == 3 ||
            project.status == 4) &&
          projectTab == 'complaint'&& <ProjectComplaint />}

        {error == null && projectTab == 'notification' && (
          <ProjectNotification />
        )}
      </div>
    </div>
  );
};
