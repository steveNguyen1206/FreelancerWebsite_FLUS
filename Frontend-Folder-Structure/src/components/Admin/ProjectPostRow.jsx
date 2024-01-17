import React, { useState, useEffect } from 'react';
import './ProjectPostRow.css';
import vietnam from '../../assets/vietnam.png';
import profileimage from '../../assets/profile_image.png';
import { StarRating } from '..';
import { useNavigate } from 'react-router';
import categoryServices from '@/services/categoryServices';
import userDataService from '@/services/userDataServices';
import eyeLight from '../../assets/eyeLight.png';
import banUser from '../../assets/banUser.png';
import banUserActive from '../../assets/banUser_active.png';
import recycleBin from '../../assets/recycleBin.png';
import projectPostServices from '@/services/projectPostServices';
import avatar_green from '../../assets/avatar_green.png';
import reviewService from '@/services/reviewServices';

const ProjectPostRow = ({
  projectId,
  projectTitle,
  projectTagsId,
  projectDetail,
  projectBudget,
  projectStatus,
  userID,
  handleBidClick,
  setRefreshProjPosts,
}) => {
  // first, get owner project
  const [ownerProject, setOwnerProject] = useState([]);

  useEffect(() => {
    fetchOwnerProject();
  }, [projectId]);

  // get User info from id
  const fetchOwnerProject = async () => {
    try {
      const ownerProjectData = await userDataService.findOnebyId(userID);
      setOwnerProject(ownerProjectData.data);
      // console.log("user data: ",ownerProjectData.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // get project tags from id
  const [projectTags, setProjectTags] = useState([]);

  useEffect(() => {
    fetchProjectTags();
  }, [projectTagsId]);

  const fetchProjectTags = async () => {
    const projectTagsData = await categoryServices.getNamefromId(projectTagsId);
    console.log(projectTagsData.data.subcategory_name);

    setProjectTags(projectTagsData.data.subcategory_name);
    // console.log('project tag: ', projectTagsData.data.subcategory_name);
  };

  const [active, setActive] = useState(projectStatus); // State to trigger refresh
  const handleChangeStatus = () => {
    const newStatus = active === 0 ? 1 : 0; // Change the logic based on your requirements
    projectPostServices
      .changeStatusByID(
        projectId,
        newStatus,
        localStorage.getItem('AUTH_TOKEN')
      )
      .then((response) => {
        console.log('Status changed: ', newStatus);
        setActive(newStatus);
        setRefreshProjPosts((prev) => !prev);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRemoveProjPost = () => {
    console.log('Remove ProjPost: ', projectId);
    projectPostServices
      .removePostById(projectId, localStorage.getItem('AUTH_TOKEN'))
      .then((response) => {
        setRefreshProjPosts((prev) => !prev);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [review, setReview] = useState([]);

  useEffect(() => {
    reviewService.getRating(userID).then((response) => {
      console.log('response: ', response);
      setReview(response.data);
    });
  }, []);

  return (
    <div className="proj-post-container">
      <div className="left-post">
        <div className="post-header">
          <div className="post-profile">
            {/* {console.log('owner project: ', ownerProject)} */}
            <img
              className="img-post"
              src={
                ownerProject.avt_url != 'https://imgur.com/gallery/ApNKGxs'
                  ? ownerProject.avt_url
                  : avatar_green
              }
              alt="profile"
            />
            <div className="post-name">{ownerProject.account_name}</div>
            <div className="post-username">({ownerProject.profile_name})</div>
            <div className="post-location">
              <img src={vietnam} alt="vietnam" />
            </div>
          </div>
        </div>
        <div className="post-title">{projectTitle}</div>

        <div className="post-tags">
          <div className="post-tag">{projectTags}</div>
        </div>
        <div className="post-detail">{projectDetail}</div>
      </div>

      <div className="right-post">
        <div className="post-reviews">
          <div className="post-rating">
            <p>{review.average}</p>
            <StarRating
              rating={review.average}
              width={100}
              className="pstars"
            />
          </div>
        </div>
        <div className="post-bid">
          <div className="post-price">
            ${`${projectBudget[0]} - ${projectBudget[1]}`}
          </div>
          <div className="btn-bid-container">
            <div class="col">
              <img
                class="recycle-bin"
                alt="Recycle bin"
                src={recycleBin}
                onClick={handleRemoveProjPost}
              />
              <img
                className="ban-icon"
                src={active === 0 ? banUserActive : banUser}
                onClick={handleChangeStatus}
              />
              <img class="eye-light" onClick={handleBidClick} src={eyeLight} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPostRow;
