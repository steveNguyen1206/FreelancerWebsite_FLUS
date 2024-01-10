import React, { useState, useEffect } from 'react';
import { WhiteButton } from '@/components';
import './hireFreelancer.css';
import exitButton from '../../assets/exitButton.png';
import UploadIcon from '../../assets/UploadIcon.png';
// import projectServices from '@/services/projectPostServices';
import subcategoryService from '@/services/subcategoryService';
import userDataService from '@/services/userDataServices';
import freelancer_post_Service from '@/services/freelancer_post_Service';
import contactService from '@/services/contactServices';
import gmailService from '@/services/gmailServices';
import projectServices from '@/services/projectServices';

const HireFreelancer = ({ isOpen, onClose, onUpdate, setShowHirePopup }) => {
    const [showOverlay, setShowOverlay] = useState(isOpen);
    const [error, setError] = useState({

    });
    const currentURL = window.location.href;
    const postId = currentURL.split("/").pop();
    // console.log(lastNumber); // Kết quả: số cuối cùng từ đường dẫn URL hiện tại
    const initState = {
        client_name: '',
        client_company: '',
        job_name: '',
        job_description: '',
        start_date: '12/31/2023',
        end_date: '01/20/2024',
        budget: 0,
        status: 0,
        project_id: 2,
        freelancer_post_id: postId,
        client_id: 5
    };

    const validateForm = () => {
        let isValid = true;
        return isValid;
    };

    const [hireFreelancer, setHireFreelancer] = useState(initState);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setHireFreelancer({ ...hireFreelancer, [name]: value });
        // console.log(newPost);
    };
    // console.log("mèo méo meo mèo meo")
    // const varCreate = 0
    const handleDoneClick = async () => {

        console.log('Done clicked.');
        // console.log(hireFreelancer);
        console.log("postId -----------> ", postId);
        const projectIdData = await projectServices.createNull();
        const projectId = projectIdData.data;
        console.log("projectId -----------> ", projectId);
        setHireFreelancer({ ...hireFreelancer, project_id: projectId });
        console.log("hireFreelancer -----------> ", hireFreelancer);
        const emailData = await freelancer_post_Service.findFreelancerEmail(postId);
        const email = emailData.data;
        console.log("email -----------> ", email);
        const emailJson = {
            "email": email
        }
        console.log("emailJson -----------> ", emailJson);
        if (validateForm()) {
            console.log("From validated successfully.")
            console.log("----------Hire freelancer------", hireFreelancer)
            await contactService

                .create(hireFreelancer)
                .then(() => {
                    console.log('Form is valid. Post submitted successfully.');
                    // varCreate = 1
                    setShowOverlay(false);
                    onUpdate();
                    if (onClose) {
                        onClose();
                    }
                })
                .catch((error) => {
                    console.error('Error submitting post:', error.message);
                });
        } else {
            console.log('Form has errors. Please fix them.');
        }

        // if (varCreate == 1) {
            gmailService.sendEmail(emailJson);
        // }
    };


    return (
        <div className='bckgrd'>
            {showOverlay && <div className="overlay" />}
            <div className="bid-popup">
                <button className="exit-button" onClick={() => {
                    setShowHirePopup(false);
                    onClose();
                }}>
                    <img src={exitButton} alt="Exit" />
                </button>
                <div className="bid-popup-header">
                    <p>Hire Freelancer</p>
                </div>

                <div className="bid-popup-body">
                    <div className="clientNameInput">
                        <label htmlFor="clientName">Client's Name *</label>
                        <input
                            type="text"
                            id="clientName"
                            name="client_name"
                            placeholder="Enter name ..."
                            onChange={handleInputChange}
                            defaultValue={hireFreelancer.client_name}
                        />
                        <div className="error-message">{error.name}</div>
                    </div>
                    <div className="client-company-input">
                        <label htmlFor="clientCompany">Company name*</label>
                        <input
                            type="text"
                            id="clientCompany"
                            name="client_company"
                            placeholder="Add company name..."
                            onChange={handleInputChange}
                            defaultValue={hireFreelancer.client_company}
                        />
                        <div className="error-message">{error.skill}</div>
                    </div>

                    <div className="client-email-input">
                        <label htmlFor="jobName">Job name *</label>
                        <input
                            type="text"
                            id="jobName"
                            name="job_name"
                            placeholder="Enter job name here..."
                            onChange={handleInputChange}
                            defaultValue={hireFreelancer.job_name}
                        />
                        <div className="error-message">{error.email}</div>
                    </div>

                    <div className="client-job-description-input">
                        <label htmlFor="clientJobDes">Job Description *</label>
                        <textarea
                            type="text"
                            id="clientJobDes"
                            name="job_description"
                            placeholder="Enter job description ..."
                            onChange={handleInputChange}
                            defaultValue={hireFreelancer.job_description}
                        />
                        <div className="error-message">{error.message}</div>
                    </div>

                    <div className="client-price-input">
                        <label htmlFor="clientPrice">Budget *</label>
                        <input
                            type="text"
                            id="clientBudget"
                            name="budget"
                            placeholder="Enter budget ..."
                            onChange={handleInputChange}
                            defaultValue={hireFreelancer.budget}
                        />
                        <div className="error-message">{error.price}</div>
                    </div>

                    <div className="project-date">
                        <div className="start-date">
                            <label htmlFor="startDate">Start date *</label>
                            <input
                                type="text"
                                id="startDate"
                                name="start_date"
                                // placeholder="Describe your skill here..."
                                // defaultValue={newPost.skill_description}
                                defaultValue={hireFreelancer.start_date}
                                onChange={handleInputChange}
                            />
                            <div className="error-message">{error.detail}</div>
                        </div>
                        <div className="end-date">
                            <label htmlFor="endDate">End date *</label>
                            <input
                                type="text"
                                id="endDate"
                                name="end_date"
                                // placeholder="Describe your skill here..."
                                defaultValue={hireFreelancer.end_date}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="error-message">{error.duration}</div>
                    </div>

                    {/* <WhiteButton text="Send" onClick={handleDoneClick} /> */}
                    <button onClick={handleDoneClick}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default HireFreelancer;