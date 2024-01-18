import React, { useState, useRef, useEffect } from 'react';
import './offerDetailTag.css';
import flag from '../../assets/vietnam.png';
import avatar from '../../assets/avatar_green.png';
import { StarRating } from '@/components';
import { Collapse } from 'react-bootstrap';
import contactService from '@/services/contactServices';
import reviewService from '@/services/reviewServices';
import { useNavigate } from 'react-router-dom';
import projectService from '@/services/projectServices';
import gmailService from '@/services/gmailServices';

const OfferDetailTag = ({ contactOne, checkOwner, onChangeBid }) => {
  const [expanded, setExpanded] = useState(false);
  const [showSeeMore, setShowSeeMore] = useState(false);
  const textContainerRef = useRef(null);
  const [review, setReview] = useState([]);
  const navigate = useNavigate();
  const skill = '';
  const initProject = {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    tag_id: '',
    contact_id: '',
    owner: '',
    member: ''
  }

  const handleAccept = async () => {
    console.log('accept');
    // console.log('contactOne.id: ', contactOne.id);
    await contactService.changeContactStatus(contactOne.id, 1).then((response) => {
      console.log('response: ', response);
      onChangeBid();
    });

    await contactService.showContactByContactId(contactOne.id).then((response) => {
      console.log('response: ', response);
      const contact = response.data[0];
      console.log('contact: ', contact);
      console.log("Freelancer Post:", contact.budget);

      const project = initProject;
      const projectId = contact.project_id;
      console.log('projectId: ', projectId);
      project.name = contact.job_name;
      project.description = contact.job_description;
      project.startDate = contact.start_date;
      project.endDate = contact.end_date;
      project.budget = contact.budget;
      project.tag_id = contact.freelancer_post.skill_tag;
      project.contact_id = contact.id;
      project.owner = contact.client_id;
      project.member = contact.freelancer_post.freelancer_id;

      console.log('project: ', project);
      projectService.createProject(project).then((response) => {
        console.log('response: ', response);
        console.log('project: ', project);
        navigate(`/project-manage/${response.data.id}`)
        const emailData = {
          email: contact.user.email,
          url: `http://localhost:8081/my-project-manage/${response.data.id}`,
        };

        gmailService.sendEmail(emailData).then((response) => {
          console.log('response: ', response);
        });
      });

      // <Route path="/project-manage/:id" element={<ProjectManagement own={false}/>} />
      // copilot :3 code navigate to project-manage/response.data.id
      // window.location.href = `/project-manage/${response.data.id}`;

    });
  };

  const handleReject = async () => {
    console.log('reject');
    console.log('contactOne.id: ', contactOne.id);
    await contactService.changeContactStatus(contactOne.id, -1).then((response) => {
      console.log('response: ', response);
      onChangeBid();
    });
    await contactService.showContactByContactId(contactOne.id).then((response) => {
      // navigate and refresh
      console.log('response: ', response);
      navigate(`/findFreelancer/${response.data[0].freelancer_post.freelancer_id}`)
      window.location.reload(); // chữa cháy
    });
  };

  useEffect(() => {
    const textContainer = textContainerRef.current;
    if (textContainer.scrollHeight > textContainer.clientHeight) {
      setShowSeeMore(true);
    } else {
      setShowSeeMore(false);
    }
  }, []);

  useEffect(() => {
    reviewService.getRating(contactOne.user.id).then((response) => {
      console.log('response: ', response);
      setReview(response.data);
    });
  }, []);

  const handleSeeMoreClick = () => {
    setExpanded(!expanded);
  };

  const textContainerStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: expanded ? 'unset' : 5,
    WebkitBoxOrient: 'vertical',
    marginBottom: '1%',
  };

  // const contactOne = {
  //     "id": 2,
  //     "client_name": "Vy Vy",
  //     "client_company": "ZyZy",
  //     "job_name": "Software",
  //     "job_description": "You have to do software for me",
  //     "start_date": "2020-12-31",
  //     "end_date": "2024-01-20",
  //     "budget": 3000,
  //     "status": 0,
  //     "project_id": 1,
  //     "createdAt": "2023-12-21T14:17:03.000Z",
  //     "updatedAt": "2023-12-21T14:17:03.000Z",
  //     "freelancer_post_id": 3,
  //     "client_id": 1,
  //     "user": {
  //         "id": 1,
  //         "account_name": "hoavienvohoang",
  //         "profile_name": "Vo Hoang Hoa Vien",
  //         "avt_url": "https://res.cloudinary.com/dunbnutmw/image/upload/v1703227364/gqxx79jsybefqcvqcop2.jpg",
  //         "email": "vohoanghoavien@gmail.com"
  //     }
  // }

  return (
    <div className="offer">
      <div className="overlap">
        <div
          className="row"
          style={{ height: '100%', width: '100%', alignItems: 'flex-start' }}
        >
          <div
            className="col"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <div className="group row">
              <div
                className="col-3"
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <img className="rectangle" alt="Rectangle" src={avatar} />
              </div>
              <div className="name-container col">
                <div className="first-line-container row">
                  <div className="text-wrapper-5">
                    {/* Nguyen Thi Truc */}
                    {contactOne.user.profile_name}
                  </div>
                  <div className="flag-container">
                    <img className="rectangle-2" alt="Rectangle" src={flag} />
                  </div>
                </div>
                <span className="text-wrapper-6">
                  {/* (cogai20) */}
                  {contactOne.user.account_name}
                </span>

                <div className="group-2">
                  <StarRating rating={review.average} width={140} />
                  <div className="rating-number">{review.average}</div>
                </div>
              </div>
            </div>
            <div
              className="detail-text-container"
              style={textContainerStyle}
              ref={textContainerRef}
            >
              {/* <Collapse in={expanded}> */}
              <div>
                <div className="job-name">
                  {/* CONTACT.JOB-NAME */}
                  {contactOne.job_name}
                </div>
                <span className="span" id="collapseSummary">
                  {/* CONTACT.JOB-DESCRIPTION. No logo? Bad logo? Ugly logo? Don’t stress! I’ve got you covered with high-quality, unique logos
                                    tailored to your brand. Make a great first impression with a professional, high-end design. With 20+
                                    years of design and branding experience, I can make you and your brand look good.... No logo? Bad logo?
                                    Ugly logo? Don’t stress! I’ve got you covered with high-quality, unique logos tailored to your brand.. */}
                  {contactOne.job_description}
                </span>
                <div className="row" style={{ marginTop: '12px' }}>
                  <div className="col date-offer">Start Date: </div>
                  <div className="col date-text">
                    {/* 11/12/2023 CONTACT.START  */}
                    {contactOne.start_date}
                  </div>
                  <div className="col date-offer">End Date: </div>
                  <div className="col date-text">
                    {/* 22/3/2232 CONTACT.END  */}
                    {contactOne.end_date}
                  </div>
                </div>
              </div>
              {/* </Collapse> */}
            </div>
            {showSeeMore && (
              <a
                className="text-wrapper-3"
                role="button"
                aria-expanded={expanded}
                onClick={handleSeeMoreClick}
              >
                {expanded ? 'See Less' : 'See More'}
              </a>
            )}
          </div>
          <div
            className="col-3"
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div className="budget-wrapper">
              {/* $600 */}${contactOne.budget}
            </div>

            {checkOwner === 2 && (
              <div className="btns">
                <div className="overlap-group-3">
                  <div className="text-wrapper-7" onClick={handleAccept}>
                    Accept
                  </div>
                </div>
                <div className="overlap-2">
                  <div className="text-wrapper-8" onClick={handleReject}>
                    Reject
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailTag;
