import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import './bid.css';
import './bidOffer.css'
// import profileImage from '../../assets/profile_image.png';
import contactService from '@/services/contactServices';
import projectService from '@/services/projectServices';
//name, skill, message, price, duration, accept, reject

const BidOffer = ({ bidOne, checkOwner }) => {
  const navigate = useNavigate();
  const skill = 'React, NodeJS';
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
    console.log('bidOne.id: ', bidOne.id);
    await contactService.changeContactStatus(bidOne.id, 1).then((response) => {
      console.log('response: ', response);
      // onChangeBid();
    });

    await contactService.showContactByContactId(bidOne.id).then((response) => {
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

      });

      // <Route path="/project-manage/:id" element={<ProjectManagement own={false}/>} />
      // copilot :3 code navigate to project-manage/response.data.id
      // window.location.href = `/project-manage/${response.data.id}`;
      
    });

  };

  const handleReject = () => {
    console.log('reject');
    console.log('bidOne.id: ', bidOne.id);
    contactService.changeContactStatus(bidOne.id, -1).then((response) => {
      console.log('response: ', response);
      // onChangeBid();
    });
  };

  return (
    <div className="offer">
      <div className="offer-header">
        <div className="image-profile">
          {/* <img src={profileImage} alt="profile" /> */}
          <img src={bidOne.user.avt_url} alt="profile" />
        </div>
        <div className="offer-username">
          {/* <h5>{uname}</h5> */}
          <h5>{bidOne.user.profile_name}</h5>
          <p style={{ color: 'green' }}>{skill}</p>
        </div>
        <div style={{outerHeight: '8px'}}>
            <div className="offer-rating">
            <p>4.5</p>
            </div>
        </div>

      </div>
      <div className="offer-body-detail">
        <div className="offer-price">
          <p>{bidOne.budget}$</p>
        </div>
      </div>
      {checkOwner === 2 && (
      <div className="offer-button">
        <button className="reject" onClick={handleReject}>
          Reject
        </button>
        <button className="accept" onClick={handleAccept}>
          Accept
        </button>
      </div>
      )}
    </div>
  );
};

export default BidOffer;