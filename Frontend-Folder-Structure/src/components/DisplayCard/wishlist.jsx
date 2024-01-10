import React, { useState, useEffect } from 'react';
import './wishlist.css';
import vietnam from '../../assets/vietnam.png';
import userDataService from '../../services/userDataServices';
import categoryServices from '../../services/categoryServices';

function WishlistPost({
  projectId,
  projectTitle,
  projectTagsId,
  projectDetail,
  projectBudget,
  userID,
  handleToProjectPostClick,
}) {
  // first, get owner project
  const [ownerProject, setOwnerProject] = useState([]);
  const [projectTags, setProjectTags] = useState('');

  useEffect(() => {
    fetchOwnerProject();
  }, [projectId]);

  useEffect(() => {
    fetchProjectTags();
  }, [projectTagsId]);

  const fetchProjectTags = async () => {
    const projectTagsData = await categoryServices.getNamefromId(projectTagsId);
    console.log(projectTagsData.data.subcategory_name);
    setProjectTags(projectTagsData.data.subcategory_name);
  };

  const fetchOwnerProject = async () => {
    try {
      const ownerProjectData = await userDataService.findOnebyId(userID);
      setOwnerProject(ownerProjectData.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  return (
    <div className="wishlist-container">
      <div className="wishlist-left">
        <div className="wishlist-header">
          <div className="wishlist-profile">
            <img src={ownerProject.avt_url} alt="profile" />
            <div className="wishlist-name">{ownerProject.account_name}</div>
            <div className="wishlist-username">
              ({ownerProject.profile_name})
            </div>
            <div className="wishlist-location">
              <img src={vietnam} alt="vietnam" />
            </div>
          </div>

          <div className="wishlist-title">{projectTitle}</div>

          <div className="wishlist-tag">{projectTags}</div>
        </div>
        <div className="wishlist-detail">{projectDetail}</div>
      </div>

      <div className="wishlist-right">
        <div className="wishlist-price">
          ${`${projectBudget[0]} - ${projectBudget[1]}`}
        </div>
        <div className="wishlist-to-project">
          <button onClick={handleToProjectPostClick}>To project post</button>
        </div>
      </div>
    </div>
  );
}

export default WishlistPost;
