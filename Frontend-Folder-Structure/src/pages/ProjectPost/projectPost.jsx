import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { StarRating, Bid } from '@/components';
import WhiteButton from '@/components/Button/WhiteButton';
import { BidDetailPopup, UpdateProject } from '..';
import BidPopup from '../Bid';
import CommentProject from '../../components/Comment/CommentProjectPost';

import projectPostServices from '@/services/projectPostServices';
import userDataService from '@/services/userDataServices';
import categoryServices from '@/services/categoryServices';
import reviewServices from '@/services/reviewServices';
import bidServices from '@/services/bidServices';
import projectPostWishlistServices from '@/services/projectPostWishlistServices';

import vietnam from '../../assets/vietnam.png';
import heart from '../../assets/heart-active.png';
import unactiveHeart from '../../assets/heart-unactive.png';
import dollar from '../../assets/dollars.png';
import line from '../../assets/line.png';
import './projectPost.css';

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState([]);
  const [isOpenBid, setIsOpenBid] = useState(false);
  const [projectTags, setProjectTags] = useState([]);
  const [user, setUser] = useState([]);
  const [owner, setOwner] = useState([]);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [bidProject, setBidProject] = useState([]);
  const [isLiked, setIsLiked] = useState('');
  const [isChangeBid, setIsChangeBid] = useState(false);

  // const userId = localStorage.getItem('LOGINID')
  const userId = 1;

  const navigate = useNavigate();

  // get user by id
  useEffect(() => {
    userDataService.findOnebyId(userId).then((response) => {
      // console.log('response: ', response);
      setUser(response.data);
    });
  }, []);

  useEffect(() => {
    projectPostServices.getProjectbyId(id).then((response) => {
      console.log('response: ', response);
      setProject(response.data);
      fetchProjectTags(response.data.tag_id);
    });
  }, [id]);

  useEffect(() => {
    fetchOwnerRating();
  }, [project.user_id]);

  useEffect(() => {
    if (isChange) {
      projectPostServices.getProjectbyId(id).then((response) => {
        console.log('response: ', response.data);
        setProject(response.data);
      });
      setIsChange(false);
    }
  }, [isChange]);

  const fetchProjectTags = async (tag_id) => {
    console.log('tag_id: ', tag_id);
    const projectTagsData = await categoryServices.getNamefromId(tag_id);
    setProjectTags([projectTagsData.data.subcategory_name]);
  };

  const fetchOwnerRating = async () => {
    try {
      const ownerRatingData = await reviewServices.getRatingClient(
        project.user_id
      );
      setOwner(ownerRatingData.data);
      // console.log(ownerRatingData.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleEditProject = () => {
    setIsEditPopupOpen(true);
  };

  const onChangeBid = () => {
    setIsChangeBid(!isChangeBid);
  };
  useEffect(() => {
    fetchBidProject();
  }, [isChangeBid]);

  useEffect(() => {
    if (isChangeBid) {
      fetchBidProject();
      setIsChangeBid(false);
    }
  }, [isChangeBid]);

  const fetchBidProject = async () => {
    try {
      const bidProjectData = await bidServices.findBidByProjectId(id);
      const bidProjectWithUser = await Promise.all(
        bidProjectData.data.map(async (bid) => {
          const userBidData = await userDataService.findOnebyId(bid.user_id);
          const userBidRatingData = await reviewServices.getRatingFreelancer(
            bid.user_id
          );
          return {
            ...bid,
            user: {
              ...userBidData.data,
              averageStar: userBidRatingData.data.averageStar,
            },
          };
        })
      );
      setBidProject(bidProjectWithUser);
      // console.log('bid project: ', bidProjectWithUser);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  const bidNum = bidProject.length;

  // check if user liked this project
  useEffect(() => {
    projectPostWishlistServices
      .isExisted(userId, id)
      .then((response) => {
        // console.log('response: ', response);
        if (response.data === true) {
          setIsLiked(heart);
        } else {
          setIsLiked(unactiveHeart);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId, id]);

  const handleLikeClick = () => {
    if (isLiked === unactiveHeart) {
      projectPostWishlistServices.create(userId, id).then((response) => {
        setIsLiked(heart);
        // console.log('response: ', response);
      });
    }
    if (isLiked === heart) {
      projectPostWishlistServices.remove(userId, id).then((response) => {
        setIsLiked(unactiveHeart);
        // console.log('response: ', response);
      });
    }
  };

  return (
    <>
      {isEditPopupOpen && (
        <UpdateProject
          isOpen={isEditPopupOpen}
          onClose={() => setIsEditPopupOpen(false)}
          projectId={id}
          onUpdate={() => {
            setIsChange(!isChange);
          }}
        />
      )}

      {isDetailOpen && (
        <BidDetailPopup
          setPopUpAppear={setIsDetailOpen}
          project_post_id={id}
          onChange={() => {
            setIsChangeBid(!isChangeBid);
          }}
        />
      )}

      {isOpenBid && (
        <BidPopup
          projectPostId={id}
          isOpen={isOpenBid}
          isClose={() => setIsOpenBid(false)}
          onChange={() => {
            setIsChangeBid(!isChangeBid);
          }}
        />
      )}
      <div className="pproject">
        <div className="left-project">
          <div className="main-post">
            <div className="border-proj-title">
              <div className="proj-title">
                <p>{project.title}</p>
              </div>
            </div>
            <div className="tags">
              <div className="tag">{projectTags[0]}</div>
            </div>
            <div className="proj-post">
              <div className="proj-poster">
                <img id="avt" src={user.avt_url} alt="profile" />
                <div className="proj-name-rating-left">
                  <div className="proj-name-wrapper-left">
                    <div className="proj-name-left">{user.account_name}</div>
                    <div className="proj-username-left">
                      ({user.profile_name})
                    </div>
                    <div className="proj-location-left">
                      <img src={vietnam} alt="vietnam" />
                    </div>
                  </div>
                  <div className="proj-rating-left">
                    <StarRating rating={owner.averageStar} width={150} />
                    <div className="proj-stars-left">
                      <p>{owner.averageStar}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="proj-body">
                <div className="proj-detail">
                  <p>{project.detail}</p>
                  <div className="wrapper-project-image">
                    <img
                      id="post-img"
                      src={project.imgage_post_urls}
                      alt="img"
                    />
                    <div className="proj-image"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="proj-line">
              <img src={line} alt="line" />
            </div>
          </div>

          <div className="comments">
            <div className="comment-title">
              <p>Comments</p>
              <div className="proj-comment-detail">
                <CommentProject project_post_id={id} user_id={userId} />
              </div>
            </div>
            <div className="proj-line">
              <img src={line} alt="line" />
            </div>
          </div>
        </div>
        <div className="right-project">
          <button onClick={handleEditProject} className="button-edit">
            Edit
          </button>
          <div className="job-profile">
            <div className="right-profile">
              <img src={user.avt_url} alt="profile" />
              <div className="project-name-wrapper-right">
                <div className="project-name-right">
                  <p>{user.account_name}</p>
                </div>
                <div className="project-username-right">
                  <p>({user.profile_name})</p>
                </div>
                <div className="project-right-stars">
                  <StarRating rating={owner.averageStar} width={100} />
                  <p>{owner.averageStar}</p>
                  <div className="project-right-nstars"></div>
                </div>
              </div>
              <div className="project-location-right">
                <img src={vietnam} alt="vietnam" />
              </div>
            </div>

            <div className="project-right-contact">
              <WhiteButton text="Chat now" />
              <WhiteButton
                text="View Profile"
                // onClick={() => {
                //   navigate(`/profile/${id}`);
                // }}
                onClick={() => {
                  window.open(`/profile/${userId}`, '_blank');
                }}
              />
            </div>
          </div>
          <div className="project-info">
            <h4>More about the project</h4>
            <div className="project-detail">
              <div className="project-detail-price">
                <img src={dollar} alt="dollar" />
                <p>${`${project.budget_min} - ${project.budget_max}`}</p>
              </div>
            </div>

            <div className="btn-bid-and-wish">
              <button
                onClick={() => {
                  setIsOpenBid(true);
                }}
                className="button-bid-project"
              >
                Bid
              </button>
              <button className="button-wish-project" onClick={handleLikeClick}>
                <img src={isLiked} alt="heart icon" />
              </button>
            </div>
          </div>
          <div className="project-bid-list-info">
            <div className="view-detail" onClick={() => setIsDetailOpen(true)}>
              <p>View details</p>
            </div>
            <p>{`${bidNum} Bids`}</p>
            <div className="proj-bid-list">
              {bidProject.map((bid) => (
                <Bid
                  key={bid.id}
                  bidId={bid.id}
                  username={bid.user.account_name}
                  price={bid.price}
                  skill={bid.skill}
                  profileImage={bid.user.avt_url}
                  rating={bid.user.averageStar}
                  email={bid.user.email}
                  projectId={id}
                  onChangeBid={onChangeBid}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Project;
