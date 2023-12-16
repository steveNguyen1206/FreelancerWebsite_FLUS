import React from 'react';
import vietnam from '../../assets/vietnam.png';
import profileimage from '../../assets/profile_image.png';
import heart from '../../assets/heart-active.png';
import './project.css';
import { StarRating } from '@/components';
import img from '../../assets/Imgs.png';
import dollar from '../../assets/dollars.png';
import location from '../../assets/location.png';
import delivery from '../../assets/delivery.png';
import WhiteButton from '@/components/Button/WhiteButton';
import line from '../../assets/line.png';
import Comment from '@/components/Comment/Comment';
import { Bid } from '@/components';
import RelatedProject from '@/components/RelatedProject/RelatedProject';
import { Carousel } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import projectServices from '@/services/projectPostServices';
import userDataService from '@/services/userDataServices';
import categoryServices from '@/services/categoryServices';
import reviewServices from '@/services/reviewServices';
import { UpdateProject } from '..';

const Project = () => {
  const { id } = useParams();
  console.log('id: ', id);
  const [project, setProject] = useState([]);

  // const userId = localStorage.getItem('LOGINID')
  const userId = 1;
  const [user, setUser] = useState([]);

  // get user by id

  useEffect(() => {
    userDataService.findOnebyId(userId).then((response) => {
      console.log('response: ', response);
      setUser(response.data);
    });
  }, []);

  useEffect(() => {
    projectServices.getProjectbyId(id).then((response) => {
      console.log('response: ', response);
      setProject(response.data);
    });
  }, []);

  const [projectTags, setProjectTags] = useState([]);

  useEffect(() => {
    fetchProjectTags();
  }, [project.tag_id]);

  const fetchProjectTags = async () => {
    const projectTagsData = await categoryServices.getNamefromId(
      project.tag_id
    );
    console.log(projectTagsData.data.subcategory_name);

    const projectTagsArray = projectTagsData.data.subcategory_name.includes(',')
      ? projectTagsData.data.subcategory_name.split(',')
      : [projectTagsData.data.subcategory_name];
    setProjectTags(projectTagsArray);
    // console.log('project tags array: ', projectTagsArray);
  };

  const [owner, setOwner] = useState([]);

  useEffect(() => {
    fetchOwnerRating();
  }, [project.user_id]);

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

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  const handleEditProject = () => {
    setIsEditPopupOpen(true);
  };


  const [isChange, setIsChange] = useState(false);
  return (
    <>
      {isEditPopupOpen && (
        <UpdateProject
          isOpen={isEditPopupOpen}
          onClose={() => setIsEditPopupOpen(false)}
          projectId={id}
          onUpdate={() => {setIsChange(!isChange)}}
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
              {projectTags.map((tag) => (
                <div className="tag">{tag}</div>
              ))}
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
                    <StarRating rating={owner.averageStar} />
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
                <Comment />
              </div>
            </div>
            <div className="proj-line">
              <img src={line} alt="line" />
            </div>
          </div>

          <div className="related-project-wrapper">
            <div className="related-project-title">
              <p>Related Projects</p>
            </div>

            <div className="related-project-list">
              <Carousel>
                <Carousel.Item>
                  <div className="related-project-item">
                    <RelatedProject />
                    <RelatedProject />
                  </div>
                </Carousel.Item>
                <Carousel.Item>
                  <div className="related-project-item">
                    <RelatedProject />
                    <RelatedProject />
                  </div>
                </Carousel.Item>
              </Carousel>
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
                  <StarRating rating={owner.averageStar} />
                  <p>{owner.averageStar}</p>
                  <div className="project-right-nstars"></div>
                </div>
              </div>
              <div className="project-location-right">
                <img src={vietnam} alt="vietnam" />
              </div>
            </div>

            <div className="project-jobs-right">
              <div className="project-job-right">
                <p>Job</p>
                <p> Your job here</p>
              </div>
              <div className="project-job-right">
                <p>Job</p>
                <p> Your job here</p>
              </div>
              <div className="project-job-right">
                <p>Job</p>
                <p> Your job here</p>
              </div>
            </div>

            <div className="project-right-contact">
              <WhiteButton name="Chat now" />
              <WhiteButton name="View Profile" />
            </div>
          </div>
          <div className="project-info">
            <h4>More about the project</h4>
            <div className="project-detail">
              <div className="project-detail-price">
                <img src={dollar} alt="dollar" />
                <p>${`${project.budget_min} - ${project.budget_max}`}</p>
              </div>
              {/* <div className="project-type">
              <img src={location} alt="location" />
              <p>Remote project</p>
            </div> */}
              <div className="project-time">
                <img src={delivery} alt="delivery" />
                <p>5 Day Delivery</p>
              </div>
            </div>

            <div className="btn-bid-and-wish">
              <button className="button-bid-project">Bid</button>
              <button className="button-wish-project">
                <img src={heart} alt="heart" />
              </button>
            </div>
          </div>
          <div className="project-bid-list-info">
            <div className="view-detail">
              <p>View details</p>
            </div>
            <p>4 BID</p>
            <div className="proj-bid-list">
              <Bid />
              <Bid />
              <Bid />
              <Bid />
              <Bid />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Project;
