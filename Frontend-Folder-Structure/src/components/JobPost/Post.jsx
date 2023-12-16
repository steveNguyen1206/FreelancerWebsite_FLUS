import React from 'react';
import './Post.css';
import vietnam from '../../assets/vietnam.png';
import heart from '../../assets/heart-active.png';
import { StarRating } from '..';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import userDataService from '../../services/userDataServices';
import reviewServices from '../../services/reviewServices';
import categoryServices from '../../services/categoryServices';

const Post = ({
  projectId,
  projectTitle,
  projectTagsId,
  projectDetail,
  projectBudget,
  userID,
  handleBidClick,
}) => {
  const navigate = useNavigate();

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
    // console.log(projectTagsData.data.subcategory_name);

    const projectTagsArray = projectTagsData.data.subcategory_name.includes(',')
      ? projectTagsData.data.subcategory_name.split(',')
      : [projectTagsData.data.subcategory_name];
    setProjectTags(projectTagsArray);
    // console.log('project tags array: ', projectTagsArray);
  };

  // get client rating of owner project
  const [owner, setOwner] = useState([]);

  useEffect(() => {
    fetchOwnerRating();
  }, [ownerProject]);

  const fetchOwnerRating = async () => {
    try {
      const ownerRatingData = await reviewServices.getRatingClient(
        ownerProject.id
      );
      setOwner(ownerRatingData.data);
      // console.log(ownerRatingData.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  return (
    <div className="post-container">
      <div className="left-post">
        <div className="pheader">
          <div className="pprofile">
            {/* {console.log('owner project: ', ownerProject)} */}
            <img src={ownerProject.avt_url} alt="profile" />
            <div className="ptname">{ownerProject.account_name}</div>
            <div className="ptusername">({ownerProject.profile_name})</div>
            <div className="pplocation">
              <img src={vietnam} alt="vietnam" />
            </div>
          </div>

          <div className="pttitle">{projectTitle}</div>

          <div className="pttags">
            {/* {console.log('project tags: ', projectTags)} */}
            {projectTags.map((subcategory_name) => (
              <div className="pttag">{subcategory_name}</div>
            ))}
          </div>
        </div>
        <div className="details">
          <div className="detail-header"></div>
          <div className="detail">
            <div className="pdetail">{projectDetail}</div>
          </div>
        </div>
      </div>

      <div className="right-post">
        <div className="previews">
          <div className="rating">
            <p>{owner.averageStar}</p>
            <StarRating
              rating={parseFloat(owner.averageStar)}
              className="pstars"
            />
          </div>
        </div>
        <div className="pbid">
          <div className="pprice">
            ${`${projectBudget[0]} - ${projectBudget[1]}`}
          </div>
          <div className="btn-p">
            <div className="btn-bid-project">
              <button onClick={handleBidClick}>Bid</button>
            </div>
            <div className="wish">
              <button>
                <img src={heart} alt="heart icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
