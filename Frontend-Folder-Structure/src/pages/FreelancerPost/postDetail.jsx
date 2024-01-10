import React from 'react';
import vietnam from '../../assets/vietnam.png';
import profileimage from '../../assets/profile_image.png';
import './postDetail.css';
import { StarRating } from '@/components';
import img from '../../assets/Imgs.png';
import dollar from '../../assets/dollars.png';
import revision from '../../assets/revision.png';
import delivery from '../../assets/delivery.png';
import line from '../../assets/line.png';
// import Comment from '@/components/Comment/Comment';
import { Bid } from '@/components';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import freelancer_post_Service from '@/services/freelancer_post_Service';
import userDataService from '@/services/userDataServices';
import categoryServices from '@/services/categoryServices';
import reviewServices from '@/services/reviewServices';
import UpdatePost from './updatePost';
import OfferDetailPopup from './offerDetailPopup';
import HireFreelancer from '../FreelancerPost/hireFreelancer';
import contactService from '@/services/contactServices';

const PostDetail = () => {
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
    freelancer_post_Service.findOnebyId(id).then((response) => {
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
    setProjectTags([projectTagsData.data.subcategory_name]);
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

  const [showHirePopup, setShowHirePopup] = useState(false);

  const handleHireProject = () => {
    setShowHirePopup(true);
  };

  const [showOfferPopup, setShowOfferPopup] = useState(false);

  const handleViewDetail = () => {
    setShowOfferPopup(true);
  };


  const [bidOnes, setBidOnes] = useState([]);
  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const bidsData = await contactService.findAllBids(id);
      setBidOnes(bidsData.data);
      console.log('data', bidsData.data);
    } catch (error) {
      console.error('Error fetching Bid:', error);
    }
  };

  return (
    <>
      {isEditPopupOpen && (
        <UpdatePost
          isOpen={isEditPopupOpen}
          onClose={() => setIsEditPopupOpen(false)}
          projectId={id}
          onUpdate={() => {setIsChange(!isChange)}}
        />
      )}
      {showHirePopup && <HireFreelancer setShowHirePopup={setShowHirePopup} /> }
      {showOfferPopup && <OfferDetailPopup setPopUpAppear={setShowOfferPopup} /> }
      <div className="pproject">
        <div className="left-project">
          <div className="main-post">
            <div className="border-proj-title">
              <div className="proj-title">
                <p>{project.title}</p>
                {/* <p>Project title here</p> */}
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
                    <StarRating rating={owner.averageStar} width={160} />
                    <div className="proj-stars-user">
                      {owner.averageStar}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="proj-detail" style={{textAlign:"left"}}>{project.skill_description}</div>
              <div className="proj-body">
                <div >
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
            <div className='about-me-section'>
              <div className='section-title'>
                About the seller
              </div>
              <div className='about-me-content'>
                  {project.about_me}
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
        </div>
        <div className="right-project">
          <button onClick={handleEditProject} className="button-edit">
            Edit
          </button>
          <div className="project-info">
            <h4>More about my job</h4>
            <div className="project-detail-wrapper">
              <div className="detail-img">
                <img src={delivery} alt="delivery" />
                <p>{project.delivery_due} Day Delivery</p>
              </div>
              <div className="detail-img">
                <img src={revision} alt="revision" />
                <p>{project.revision_number} Revision</p>
              </div>
              
            </div>
            <div className="detail-img">
                {/* <ul>
                  <li>1 concept included</li>
                  <li> Logo transparency</li>
                  <li>Vector file</li>
                  <li>Include social media kit</li>
                </ul> */}
                {project.delivery_description}
              </div>

            <div className="btn-hire">
              <button className="button-hire-project" onClick={handleHireProject}>Hire me</button>
              <div className="budget-wrapper">
                {`$${100}`}
              </div>
            </div>
          </div>
          <div className="project-bid-list-info">
            <div className="view-detail" onClick={handleViewDetail}>
              <p>View details</p>
            </div>
            <p>4 Offers</p>
            <div className="proj-bid-list">

              {bidOnes.map((bidOne) => (
                <Bid bidOne = {bidOne}/>
              ))}
              
              {/* <Bid />
              <Bid />
              <Bid />
              <Bid />
              <Bid /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetail;