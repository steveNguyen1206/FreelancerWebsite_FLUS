import React, { useState, useEffect } from 'react';
import './profile.css';
import profileCover from '../../assets/profile_cover.jpg';
import linkedinicon from '../../assets/SocialIcon/linkedin.png';
import editIcon from '../../assets/editProfileIcon.png';
import {
  StarRating,
  Tag,
  PopupUpdateProfile,
  UpdateButton,
} from '@/components';
import { SignUp } from '@/pages';
import { useParams, useNavigate } from 'react-router';
import userDataService from '@/services/userDataServices';
import userSubcategoryService from '@/services/userSubcategoryServices';
import { Link } from 'react-router-dom';
import {
  ProjectPostsTab,
  FreelancerPostsTab,
  WishlistTab,
  CalendarTab,
  PaymentAccountTab,
} from '@/components';

const profile = () => {
  const this_id = localStorage.getItem('LOGINID');
  const { id } = useParams();
  
  const isOwnProfile = (this_id === id);

  let navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [refresh, setRefresh] = useState(0);

  const initialProfileState = {
    id: '',
    account_name: '',
    profile_name: '',
    phone_number: '',
    nationality: '',
    user_type: 0,
    email: '',
    avt_url: '',
    social_link: '',
  };

  const [userProfile, setUserProfile] = useState(initialProfileState);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [userSkills, setUserSkills] = useState([]);

  const handleUpdateProfile = () => {
    setShowUpdateProfile(true);
  };

  const handleClosePopupUpdateProfile = () => {
    setShowUpdateProfile(false);
    setRefresh(1- refresh);
  };

  const getUserProfile = (id) => {
    userDataService
      .findOnebyId(id)
      .then((response) => {
        setUserProfile(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  
  // get all skills of an user
  const getUserSkills = (id) => {
    userSubcategoryService
      .findAll(id)
      .then((response) => {
        setUserSkills(response.data);
        setRefresh();
      })
      .catch((e) => {
        setErrorMessage(e.message);
      });
  };

  useEffect(() => {
    if (id) {
      getUserProfile(id);
      getUserSkills(id);
    }
  }, [id, refresh]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const goToProjectsCreated = () => {
    navigate(`/my-project-manage`);
  };

  const goToProjectsJoined = () => {
    navigate(`/project-manage`);
  };

  return (
    <div>
      {/* Update Profile Popup */}
      {showUpdateProfile && (
        <PopupUpdateProfile
          // m_state={showUpdateProfile}
          // m_function={setShowUpdateProfile}
          user_profile={userProfile}
          handleCloseIconClick={handleClosePopupUpdateProfile}
        />
      )}

      {userProfile ? (
        <div className="profile">
          <div className="overlap">
            <div className="profile-info-section">
              <div className="cover-avatar-section">
                <img className="rectangle" alt="Rectangle" src={profileCover} />
                <div className="avatar-container">
                  <img
                    className="ellipse"
                    alt="Avatar"
                    src={userProfile.avt_url}
                  />
                </div>
              </div>
              <div className="information-section">
                <div className="frame">
                  <p className="name-section">
                    <span className="text-wrapper">
                      {userProfile.profile_name}{' '}
                    </span>
                    <span className="span">({userProfile.account_name})</span>

                    {isOwnProfile && (
                      <div
                        className="edit-container"
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        {/* <span style={{fontSize:"16px", marginRight:"10px"}}>Edit</span> */}
                        <img
                          className="image"
                          alt="edit profile"
                          src={editIcon}
                          onClick={handleUpdateProfile}
                        />
                      </div>
                    )}
                  </p>
                  <div className="text-wrapper-2">
                    Junior FullStack Developer
                  </div>
                </div>

                <div className="navigate-container">
                  <div className="social-link">
                    <img className="img" alt="Ellipse" src={linkedinicon} />
                    <Link
                      className="text-wrapper-3"
                      to={userProfile.social_link}
                    >
                      TrucVy
                    </Link>
                  </div>

                  {isOwnProfile && (
                    <div className="to-projects-manager">
                      <div className="navigate-button">
                        <UpdateButton
                          button_name={'Projects Created'}
                          onClick={goToProjectsCreated}
                        />
                      </div>
                      <div className="navigate-button">
                        <UpdateButton
                          button_name={'Projects Joined'}
                          onClick={goToProjectsJoined}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="rating-bar">
                <StarRating rating={4.6} width={160} />

                <div className="text-wrapper-6">{4.6}</div>
              </div>
            </div>
          </div>
          <div className="overlap-5">
            <div className="overlap-wrapper">
              <div className="overlap-6">
                <div className="frame-2">
                  <div className="text-wrapper-7">My Job Tags:</div>
                  <div className="tag-box">
                    <div className="tag-box-inner">
                      {userSkills.map((skill) => (
                        <Tag string={skill.subcategory_name} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="overlap-10">
                  <div className="rectangle-2" />
                  <div className="tab-container">
                    <div
                      className={`${
                        activeTab === 0 ? 'active group-6' : 'group-6'
                      }`}
                      onClick={() => handleTabClick(0)}
                    >
                      <div className="text-wrapper-11">Project Post</div>
                    </div>
                    <div
                      className={`${
                        activeTab === 1 ? 'group-6 active' : 'group-6'
                      }`}
                      onClick={() => handleTabClick(1)}
                    >
                      <div className="text-wrapper-11">Freelancer Post</div>
                    </div>
                    {isOwnProfile && (
                      <div
                        className={`${
                          activeTab === 2 ? ' group-6 active' : 'group-6'
                        }`}
                        onClick={() => handleTabClick(2)}
                      >
                        <div className="text-wrapper-11">Wishlist</div>
                      </div>
                    )}
                    {isOwnProfile && (
                      <div
                        className={`${
                          activeTab === 3 ? 'group-6 active' : 'group-6'
                        }`}
                        onClick={() => handleTabClick(3)}
                      >
                        <div className="text-wrapper-11">Calendar</div>
                      </div>
                    )}
                    {isOwnProfile && (
                      <div
                        className={`${
                          activeTab === 4 ? 'active group-6' : 'group-6'
                        }`}
                        onClick={() => handleTabClick(4)}
                      >
                        <div className="text-wrapper-11">Payment Account</div>
                      </div>
                    )}
                  </div>
                  <div className="main-tab-container">
                    {activeTab === 0 && (
                      <ProjectPostsTab userId={userProfile.id} />
                    )}
                    {activeTab === 1 && (
                      <FreelancerPostsTab userId={userProfile.id} />
                    )}
                    {isOwnProfile && activeTab === 2 && (
                      <WishlistTab userId={userProfile.id} />
                    )}
                    {isOwnProfile && activeTab === 3 && (
                      <CalendarTab userId={userProfile.id} />
                    )}
                    {isOwnProfile && activeTab === 4 && (
                      <PaymentAccountTab userId={userProfile.id} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <SignUp />
        </div>
      )}
    </div>
  );
};
export default profile;
