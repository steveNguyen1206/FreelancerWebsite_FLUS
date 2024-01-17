import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { StarRating, Bid } from '@/components';
import WhiteButton from '@/components/Button/WhiteButton';
import { BidDetailPopup, UpdateProject } from '..';
import BidPopup from '../Bid';
import CommentProject from '../../components/Comment/CommentProjectPost';

import projectPostServices from '@/services/projectPostServices';
import bidServices from '@/services/bidServices';
import projectPostWishlistServices from '@/services/projectPostWishlistServices';
import reviewService from '@/services/reviewServices';

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
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [bidProject, setBidProject] = useState([]);
  const [isLiked, setIsLiked] = useState('');
  const [isChangeBid, setIsChangeBid] = useState(false);
  const [projectId, setProjectId] = useState();
  const [loading, setLoading] = useState(false);
  const [isOwnerProjectPost, setIsOwnerProjectPost] = useState(false);
  const [review, setReview] = useState('');

  const navigate = useNavigate();

  const onChangeProjectId = (id) => {
    setProjectId(id);
  };

  useEffect(() => {
    if (projectId) {
      navigate(`/my-project-manage/${projectId}`);
    }
  }, [projectId]);

  useEffect(() => {
    projectPostServices.getOnebyId(id).then((response) => {
      setProject(response.data);
      setLoading(true);
      // console.log('response: ', response.data);
    });
  }, [id]);

  useEffect(() => {
    if (project && project.user) {
      const fetchRating = async () => {
        const response = await reviewService.getRating(project.user.id);
        setReview(response.data);
        // console.log('response: ', response);
      };
      fetchRating();
    }
  }, [project]);

  useEffect(() => {
    if (isChange) {
      projectPostServices.getOnebyId(id).then((response) => {
        // console.log('response: ', response.data);
        setProject(response.data);
      });
      setIsChange(false);
    }
  }, [isChange]);

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
      const bidProjectData = await bidServices.findBidByProjectPostId(
        id,
        localStorage.getItem('AUTH_TOKEN')
      );
      setBidProject(bidProjectData.data);
      // console.log('bidProjectData: ', bidProjectData.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  const bidNum = bidProject.length;

  useEffect(() => {
    projectPostWishlistServices
      .isExisted(id, localStorage.getItem('AUTH_TOKEN'))
      .then((response) => {
        if (response.data === true) {
          setIsLiked(heart);
        } else {
          setIsLiked(unactiveHeart);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleLikeClick = () => {
    if (isLiked === unactiveHeart) {
      projectPostWishlistServices
        .create(id, localStorage.getItem('AUTH_TOKEN'))
        .then((response) => {
          setIsLiked(heart);
        });
    }
    if (isLiked === heart) {
      projectPostWishlistServices
        .remove(id, localStorage.getItem('AUTH_TOKEN'))
        .then((response) => {
          setIsLiked(unactiveHeart);
        });
    }
  };

  useEffect(() => {
    if (project.user) {
      if (project.user.id == localStorage.getItem('LOGINID')) {
        setIsOwnerProjectPost(true);
      }
    }
  }, [project]);

  if (loading)
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
            onChange={() => {
              setIsChangeBid(!isChangeBid);
            }}
            bidProject={bidProject}
            projectPost={project}
            isOwnerProjectPost={isOwnerProjectPost}
            onChangeProjectId={onChangeProjectId}
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
            budgetMin={project.budget_min}
            budgetMax={project.budget_max}
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
                <div className="tag">
                  {project.subcategory.subcategory_name}
                </div>
              </div>
              <div className="proj-post">
                <div className="proj-poster">
                  <img id="avt" src={project.user.avt_url} alt="profile" />
                  <div className="proj-name-rating-left">
                    <div className="proj-name-wrapper-left">
                      <div className="proj-name-left">
                        {project.user.account_name}
                      </div>
                      <div className="proj-username-left">
                        ({project.user.profile_name})
                      </div>
                      <div className="proj-location-left">
                        <img src={vietnam} alt="vietnam" />
                      </div>
                    </div>
                    <div className="proj-rating-left">
                      <StarRating rating={review.average} width={150} />
                      <div className="proj-stars-left">
                        <p>{review.average}</p>
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
                  <CommentProject project_post_id={id} />
                </div>
              </div>
              <div className="proj-line">
                <img src={line} alt="line" />
              </div>
            </div>
          </div>
          <div className="right-project">
            {isOwnerProjectPost && (
              <button onClick={handleEditProject} className="button-edit">
                Edit
              </button>
            )}
            <div className="job-profile">
              <div className="right-profile">
                <img src={project.user.avt_url} alt="profile" />
                <div className="project-name-wrapper-right">
                  <div className="project-name-right">
                    <p>{project.user.account_name}</p>
                  </div>
                  <div className="project-username-right">
                    <p>({project.user.profile_name})</p>
                  </div>
                  <div className="project-right-stars">
                    <StarRating rating={review.average} width={100} />
                    <p>{review.average}</p>
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
                    window.open(`/profile/${project.user.id}`, '_blank');
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
                <div className="project-detail-time">
                  <p>
                    Start date:{' '}
                    {new Date(project.start_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="btn-bid-and-wish">
                {!isOwnerProjectPost && (
                  <button
                    onClick={() => {
                      setIsOpenBid(true);
                    }}
                    className="button-bid-project"
                  >
                    Bid
                  </button>
                )}
                <button
                  className="button-wish-project"
                  onClick={handleLikeClick}
                >
                  <img src={isLiked} alt="heart icon" />
                </button>
              </div>
            </div>
            <div className="project-bid-list-info">
              <div
                className="view-detail"
                onClick={() => setIsDetailOpen(true)}
              >
                <p>View details</p>
              </div>
              <p>{`${bidNum} Bids`}</p>
              <div className="proj-bid-list">
                {bidProject.map((bid) => (
                  <Bid
                    key={bid.id}
                    bid={bid}
                    onChangeBid={onChangeBid}
                    onChangeProjectId={onChangeProjectId}
                    isOwnerProjectPost={isOwnerProjectPost}
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
