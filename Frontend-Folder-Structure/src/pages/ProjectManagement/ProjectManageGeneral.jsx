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
  ProjectReview,
} from '.';
import { createContext, useContext, useState } from 'react';
import { useProjectManageContext } from './ProjectManageProvider';
import { useEffect } from 'react';
import projectService from '@/services/projectServices';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

export const ProjectManageGeneral = () => {
  const {
    project,
    setProject,
    isOwn,
    projectTab,
    setProjectTab,
    notis,
    setNotis,
  } = useProjectManageContext();
  const [error, setError] = useState(null);
  const [allProject, setAllProject] = useState([]);
  const [search, setSearch] = useState([]);
  const [filter, setFilter] = useState(0); // 0: all, 3: completed, 4: canceled
  let navigate = useNavigate();

  const getNotis = (projectId) => {
    console.log('noti: ', projectId);
    projectService
      .getALlNotifications(projectId, localStorage.getItem('AUTH_TOKEN'))
      .then((notis_data) => {
        setNotis(notis_data.data);
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.message);
      });
  };

  const getProject = (projectId) => {
    if (isOwn) {
      projectService
        .findOwnerOnebyId(projectId, localStorage.getItem('AUTH_TOKEN'))
        .then((response) => {
          setProject(response.data);
          getNotis(projectId);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
          setError(e.response.data.message);
        });
    } else {
      projectService
        .findMemberOnebyId(projectId, localStorage.getItem('AUTH_TOKEN'))
        .then((response) => {
          setProject(response.data);
          getNotis(projectId);
          console.log(response.data);
          // console.log("test", isOwn);
        })
        .catch((e) => {
          setError(e.response.data.message);
          // console.log(e.response.data.message);
          console.log(e);
        });
    }
  };
  const getAllProject = () => {
    if (isOwn) {
      projectService
        .getAllOwnProjects(localStorage.getItem('AUTH_TOKEN'))
        .then((response) => {
          setAllProject(response.data);
          setSearch(response.data);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
          setError(e.response.data.message);
        });
    } else {
      projectService
        .getAllMemberProjects(localStorage.getItem('AUTH_TOKEN'))
        .then((response) => {
          setAllProject(response.data);
          setSearch(response.data);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
          setError(e.response.data.message);
        });
    }
  };

  const navigateToProject = (projectId) => {
    // Use the navigate function
    console.log(projectId);
    const url =
      (isOwn ? '/my-project-manage/' : '/project-manage/') + projectId;
    console.log(url);
    getProject(projectId);
    navigate(url);
  };

  useEffect(() => {
    if (project.id) {
      getProject(project.id);
    }
    getAllProject();
    console.log(error);
  }, []);

  const handleSearch = (event) => {
    const { value } = event.target;
    let filteredProject = [];
    console.log(value);
    if (value == 3 || value == 4  || value == 5  || value == 2) {
      filteredProject = allProject.filter((project) => {
        return project.status == value;
      });
    } else {
      const search = value.toLowerCase();
      filteredProject = allProject.filter((project) => {
        return project.project_name.toLowerCase().includes(search);
      });
    }
    setFilter(value);
    setSearch(filteredProject);
  };

  return (
    <div className="qun-l-d-n">
      <div className="tm-d-n">
        <div className="title-wrapper">
          <h5 className="title-text --color-green --size-20">My projects</h5>
        </div>

        <form className="gr-search">
          <input
            className="label-text"
            type="text"
            placeholder="Search"
            onChange={handleSearch}
          />
          <img
            className="search-icon"
            src="https://c.animaapp.com/6LZYVBLH/img/search-icon-1.svg"
          />
        </form>

        <div className="gr-findskill">
          {/* render class based on search state */}
          
            <button
              className={
                (filter == "")
                  ?( ' fillter-wrapper --background-green-accent value-text --color-white --size-16')
                  : ('fillter-wrapper --background-white value-text --color-green --size-16')
              }
              value={""}
              onClick={handleSearch}
            >
              All
            </button>

          <button
             className={
              filter == "3" 
                ? ' fillter-wrapper --background-green-accent value-text --color-white --size-16'
                : 'fillter-wrapper --background-white value-text --color-green --size-16'
            }
            value={3}
            onClick={handleSearch}
          >
            Completed
          </button>

          <button
             className={
              filter == "2" 
                ? ' fillter-wrapper --background-green-accent value-text --color-white --size-16'
                : 'fillter-wrapper --background-white value-text --color-green --size-16'
            }
            value={2}
            onClick={handleSearch}
          >
            Inprogress
          </button>

          <button
             className={
              filter == 4 
                ? ' fillter-wrapper --background-green-accent value-text --color-white --size-16'
                : 'fillter-wrapper --background-white value-text --color-green --size-16'
            }
            value={4}
            onClick={handleSearch}
          >
            Canceled
          </button>


          <button
             className={
              filter == 5
                ? ' fillter-wrapper --background-green-accent value-text --color-white --size-16'
                : 'fillter-wrapper --background-white value-text --color-green --size-16'
            }
            value={5}
            onClick={handleSearch}
          >
            Closed
          </button>
        </div>

        <div className="all-project-container">
          {search.map((map_project) => (
            <div
              className={
                'all-project-item' +
                (project.id == map_project.id ? ' --background-gradient' : '')
              }
              style={{ marginTop: '16px' }}
              onClick={() => navigateToProject(map_project.id)}
            >
              <div className="project-img" />
              <h4 className="title-text --size-16">
                {map_project.project_name}
              </h4>
            </div>
          ))}
        </div>
      </div>

      <div className="frame">
        <div className="project-title-container">
          <h2 className="title-text --size-28 --color-white">
            {project.status == 0 ? 'Configure Project' : project.project_name}
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
            project.status == 4 ||
            project.status == 5) &&
          projectTab == 'general' && <ProjectContent />}
        {error == null &&
          (project.status == 1 ||
            project.status == 2 ||
            project.status == 3 ||
            project.status == 4 ||
            project.status == 5) &&
          projectTab == 'report' &&
          (isOwn ? <ProjectReportJudging /> : <ProjectReport />)}

        {error == null &&
          (project.status == 1 ||
            project.status == 2 ||
            project.status == 3 ||
            project.status == 4 ||
            project.status == 5) &&
          projectTab == 'complaint' && <ProjectComplaint />}

        {error == null && projectTab == 'notification' && (
          <ProjectNotification />
        )}

        {error == null && projectTab == 'review' && (
          <ProjectReview />
        )}
      </div>
    </div>
  );
};
