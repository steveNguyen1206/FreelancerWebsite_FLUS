import React, { useState, useEffect } from 'react';
import './FreelancerPostRow.css';
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
import freelancer_post_Service from '@/services/freelancer_post_Service';
import avatar_green from '../../assets/avatar_green.png';
import reviewService from '@/services/reviewServices';

const FreelancerPostRow = ({
  key,
  freepostId,
  freepostTitle,
  freepostTagsId,
  freepostDescription,
  freepostBudget,
  freepostStatus,
  userID,
  handleViewClick,
  setRefreshFreePosts,
}) => {
  // first, get owner freepost
  const [ownerProject, setOwnerProject] = useState([]);

  useEffect(() => {
    fetchOwnerProject();
  }, [freepostId]);

  // get User info from id
  const fetchOwnerProject = async () => {
    try {
      const ownerProjectData = await userDataService.findOnebyId(userID);
      setOwnerProject(ownerProjectData.data);
      // console.log("user data: ",ownerProjectData.data);
    } catch (error) {
      console.error('Error fetching freeposts:', error);
    }
  };

  // get freepost tags from id
  const [freepostTags, setFreePostTags] = useState([]);

  useEffect(() => {
    fetchPostTags();
  }, [freepostTagsId]);

  const fetchPostTags = async () => {
    const freepostTagsData = await categoryServices.getNamefromId(
      freepostTagsId
    );
    console.log(freepostTagsData.data.subcategory_name);

    setFreePostTags(freepostTagsData.data.subcategory_name);
    // console.log('freepost tag: ', freepostTagsData.data.subcategory_name);
  };

  const [active, setActive] = useState(freepostStatus); // State to trigger refresh
  const handleChangeStatus = () => {
    const newStatus = active == 0 ? 1 : 0; // Change the logic based on your requirements
    freelancer_post_Service
      .changeStatusByID(
        freepostId,
        newStatus,
        localStorage.getItem('AUTH_TOKEN')
      )
      .then((response) => {
        console.log('Status changed: ', newStatus);
        setActive(newStatus);
        setRefreshFreePosts((prev) => !prev);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRemoveProjPost = () => {
    console.log('Remove ProjPost: ', freepostId);
    freelancer_post_Service
      .removePostById(freepostId, localStorage.getItem('AUTH_TOKEN'))
      .then((response) => {
        setRefreshFreePosts((prev) => !prev);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [review, setReview] = useState({});
  useEffect(() => {
    reviewService
      .getRatingFreelancer(userID)
      .then((response) => {
        setReview(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="free-post-container">
      <div className="left-post">
        <div className="pheader">
          <div className="pprofile">
            <img
              src={
                ownerProject.avt_url != 'https://imgur.com/gallery/ApNKGxs'
                  ? ownerProject.avt_url
                  : avatar_green
              }
              alt="profile"
            />
            <div className="pname">{ownerProject.profile_name} </div>
            <div className="pusername">({ownerProject.account_name})</div>
            <div className="plocation">
              <img src={vietnam} alt="vietnam" />
            </div>
          </div>
        </div>
        <div className="content-container">
          <div className="ptitle">{freepostTitle}</div>
          <div className="post-tag">{freepostTags}</div>
          <div className="details">
            <div className="detail-content">
              {/* Hello everyone, my name is Duy Khang Ho. This job is hard... Detail
                    text here everyone text here everyone Hello everyone, my name is Duy
                    Khang Ho. This job is hard... Detail text here ever... Detail text
                    here everyone text here everyone Hello everyone, my name is Duy Khang
                    Ho.Hello everyone, my name is Duy Khang Ho. This job is hard... Detail
                    text here everyone text here everyone Hello everyone, my name is Duy
                    Khang Ho. This job is hard... Detail text here ever... Detail text
                    here everyone text here everyone Hello everyone, my name is Duy Khang
                    Ho. */}
              {freepostDescription}
            </div>
          </div>
        </div>
      </div>

      <div className="right-post">
        <div className="previews">
          <div className="rating-row">
            <StarRating rating={review.averageStar} width={160} className="pstars" />
            <div style={{}}>{review.averageStar}</div>
          </div>
          <div className="num-reviews-wrapper">{review.count + "  reviews"}</div>
        </div>
        <div className="pbid">
          <div className="pprice">From ${freepostBudget}</div>
          <div className="btn-row">
            <div class="col">
              <img
                class="recycle-bin"
                alt="Recycle bin"
                src={recycleBin}
                onClick={handleRemoveProjPost}
              />
              <img
                className="ban-icon"
                src={active == 0 ? banUserActive : banUser}
                onClick={handleChangeStatus}
              />
              <img class="eye-light" onClick={handleViewClick} src={eyeLight} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerPostRow;
