import React from 'react';
import './job.css';
import Search from '@/components/Search';
import Post from '@/components/JobPost/Post';
import Filter from '@/components/Filter';
import projectPostServices from '@/services/projectPostServices';
import reviewServices from '@/services/reviewServices';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { NewProject } from '../Project/';

const Job = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedRange, setSelectedRange] = useState([0, 10000]);

  const fetchProjects = async () => {
    try {
      const projectsData = await projectPostServices.getAllProjects();

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
    fetchProjects();
  }, []);

  console.log('projects', projects);

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
        return projects.sort((a, b) => a.ownerRating - b.ownerRating);
      case 'review-desc':
        return projects.sort((a, b) => b.ownerRating - a.ownerRating);
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
                <button className="btn-new-post" onClick={handleNewProject}>
                  + New Post
                </button>
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
            {sortProjects(filteredProjects).map((project) => (
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
        </div>
      </div>
    </>
  );
};

export default Job;
