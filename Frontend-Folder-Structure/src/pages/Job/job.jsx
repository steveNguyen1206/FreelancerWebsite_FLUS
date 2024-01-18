import React from 'react';
import './job.css';
import Search from '@/components/Search';
import Post from '@/components/JobPost/Post';
import Filter from '@/components/Filter';
import projectPostServices from '@/services/projectPostServices';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { NewProject } from '../ProjectPost';

const Job = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedRange, setSelectedRange] = useState([0, 10000]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const projectsData = await projectPostServices.getAll();
      // console.log('projectsData', projectsData);
      setProjects(projectsData.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleNewProject = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    if (isChange) {
      fetchProjects();
      setIsChange(false);
    }
  }, [isChange]);

  const handleSearchChange = (event) => {
    setSearchTitle(event.target.value);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
      // if selectedTags is empty, ignore the tag filter
      (selectedTags.length === 0 || selectedTags.includes(project.tag_id)) &&
      project.budget_min >= selectedRange[0] &&
      project.budget_max <= selectedRange[1]
  );

  const sortProjects = (projects) => {
    switch (sortOption) {
      case 'min-asc':
        return projects.sort((a, b) => a.budget_min - b.budget_min);
      case 'max-asc':
        return projects.sort((a, b) => a.budget_max - b.budget_max);
      case 'min-desc':
        return projects.sort((a, b) => b.budget_min - a.budget_min);
      case 'max-desc':
        return projects.sort((a, b) => b.budget_max - a.budget_max);
      case 'review-asc':
        return projects.sort((a, b) => a.user.avg_rating - b.user.avg_rating);
      case 'review-desc':
        return projects.sort((a, b) => b.user.avg_rating - a.user.avg_rating);
      default:
        return projects;
    }
  };

  const handleFilterChange = (newSelectedTags) => {
    setSelectedTags(newSelectedTags);
  };

  const handleRangeChange = (newSelectedRange) => {
    setSelectedRange(newSelectedRange);
  };

  return (
    <>
      {isOpen && (
        <NewProject
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onUpdate={() => {
            setIsChange(true);
          }}
        />
      )}

      <div className="job-page">
        <div className="content">
          <div className="containerp">
            <div className="topbar">
              <div className="button">
                {isLoggedIn && (
                  <button className="btn-new-post" onClick={handleNewProject}>
                    + New Post
                  </button>
                )}
              </div>
              <Search onSearchChange={handleSearchChange} />
              <select
                value={sortOption}
                className="sort"
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="" disabled defaultValue>
                  Sort
                </option>
                <option value="min-asc">Min budget ascending</option>
                <option value="max-asc">Max budget ascending</option>
                <option value="min-desc">Min budget descending</option>
                <option value="max-desc">Max budget descending</option>
                <option value="review-asc">Review ascending</option>
                <option value="review-desc">Review descending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="c-container">
          <div className="left-job">
            <Filter
              selectedTags={selectedTags}
              onSelectedTagsChange={handleFilterChange}
              onSelectedRangeChange={handleRangeChange}
            />
          </div>
          <div className="right-job">
            {filteredProjects.length == 0 && (
              <div className="no-post">No posts found!!!</div>
            )}
            {sortProjects(filteredProjects).map((project) => (
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
        </div>
      </div>
    </>
  );
};

export default Job;
