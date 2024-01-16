import React, { useState, useEffect } from 'react';
import { WhiteButton } from '@/components';
import './hireFreelancer.css';
import exitButton from '../../assets/exitButton.png';
import UploadIcon from '../../assets/UploadIcon.png';
import subcategoryService from '@/services/subcategoryService';
import userDataService from '@/services/userDataServices';
import freelancer_post_Service from '@/services/freelancer_post_Service';
import contactService from '@/services/contactServices';
import gmailService from '@/services/gmailServices';
import projectServices from '@/services/projectServices';

const isValidClientName = (client_name) => {
    // if client_name is empty return true
    // if client_name is not empty, make sure it's at least 2 characters long and maximum 50 characters long
    // client_name include a->z, A->Z, 0->9, space, dot, comma, dash, underscore
    return (client_name.length >= 2 && client_name.length <= 50 && /^[a-zA-Z0-9 .,\\-_]+$/.test(client_name));
};

const isValidClientCompany = (client_company) => {
    // if client_company is empty return true
    // if client_company is not empty, make sure it's at least 2 characters long and maximum 50 characters long
    return (client_company.length >= 2 && client_company.length <= 50 && /^[a-zA-Z0-9 .,\\-_]+$/.test(client_company));
};

const isValidJobName = (job_name) => {
    // if job_name is empty return true
    // if job_name is not empty, make sure it's at least 2 characters long and maximum 50 characters long
    return (job_name.length >= 2 && job_name.length <= 50 && /^[a-zA-Z0-9 .,\\-_]+$/.test(job_name));
};

const isValidJobDescription = (job_description) => {
    return (job_description.length >= 2 && job_description.length <= 512 && /^[a-zA-Z0-9 .,\\-_]+$/.test(job_description));
}

const isValidBudget = (budget) => {
    // budget must be a double number between 100 and 1000000
    return (budget >= 100 && budget <= 1000000 && /^[0-9]+$/.test(budget));
};

const isValidStartDate = (start_date) => {
    // start_date must be a date in the past
    // must be mm/dd/yyyy format (01 <= mm <= 12, 01 <= dd <= 31, 2000 <= yyyy <= 2100)
    const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(2000|20[0-9][0-9]|2100)$/;
    
    return datePattern.test(start_date) && new Date(start_date) > new Date();
}


const isValidEndDate = (end_date) => {
    const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(2000|20[0-9][0-9]|2100)$/;
    return datePattern.test(end_date);
}

const isValidStartEndDate = (start_date, end_date) => {
    // start_date < end_date
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    // start_date > current date
    const currentDate = new Date();
    // return startDate < endDate;
    return startDate < endDate ;
}

const HireFreelancer = ({ isOpen, onClose, onUpdate, setShowHirePopup }) => {
    const [showOverlay, setShowOverlay] = useState(isOpen);
    const [error, setError] = useState({
        client_name: '',
        client_company: '',
        job_name: '',
        job_description: '',
        start_date: '',
        end_date: '',
        budget: '',
    });


    const currentURL = window.location.href;
    console.log("currentURL -----------> ", currentURL);
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
        project_id: 0,
        freelancer_post_id: postId,
        client_id: ''
    };

    const validateForm = () => {
        let isValid = true;
        const newError = { ...error };

        if (!isValidClientName(hireFreelancer.client_name)) {
            newError.client_name = 'Client name must be between 2 and 50 characters long and only contain a-z, A-Z, 0-9, space';
            isValid = false;
        } else {
            newError.client_name = '';
        }

        if (!isValidClientCompany(hireFreelancer.client_company)) {
            newError.client_company = 'Client company must be between 2 and 50 characters long and only contain a-z, A-Z, 0-9, space';
            isValid = false;
        } else {
            newError.client_company = '';
        }

        if (!isValidJobName(hireFreelancer.job_name)) {
            newError.job_name = 'Job name must be between 2 and 50 characters long and only contain a-z, A-Z, 0-9, space';
            isValid = false;
        } else {
            newError.job_name = '';
        }

        if (!isValidJobDescription(hireFreelancer.job_description)) {
            newError.job_description = 'Job description must be between 2 and 512 characters long and only contain a-z, A-Z, 0-9';
            isValid = false;
        } else {
            newError.job_description = '';
        }

        if (!isValidBudget(hireFreelancer.budget)) {
            newError.budget = 'Budget must be a number between 100 and 1000000';
            isValid = false;
        } else {
            newError.budget = '';
        }

        if (!isValidStartDate(hireFreelancer.start_date)) {
            // newError.start_date = 'Start date must be mm/dd/yyyy format (01 <= mm <= 12, 01 <= dd <= 31, 2000 <= yyyy <= 2100)';
            newError.start_date = 'Start date must be mm/dd/yyyy format (01 <= mm <= 12, 01 <= dd <= 31, 2000 <= yyyy <= 2100) and greater than current date';
            isValid = false;
        } else {
            newError.start_date = '';
        }

        if (!isValidEndDate(hireFreelancer.end_date) || !isValidStartEndDate(hireFreelancer.start_date, hireFreelancer.end_date)) {
            newError.end_date = 'End date must be mm/dd/yyyy format (01 <= mm <= 12, 01 <= dd <= 31, 2000 <= yyyy <= 2100) and greater than start date';
            isValid = false;
        } else {
            newError.end_date = '';
        }
        setError(newError);

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

    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        console.log(key);
    }
    // console.log("userId from localStorage -----------> ", localStorage.getItem('LOGINID'));
    const handleDoneClick = async () => {

        console.log('Done clicked.');
        console.log("postId -----------> ", postId);
        console.log("hireFreelancer -----------> ", hireFreelancer);
        const emailData = await freelancer_post_Service.findFreelancerEmail(postId);
        const email = emailData.data;
        console.log("email -----------> ", email);
        const emailJson = {
            "email": email,
            "url": currentURL
        }
        console.log("emailJson -----------> ", emailJson);
        console.log("validateForm() -----------> ", validateForm());
        if (validateForm()) {
            console.log("From validated successfully.")
            hireFreelancer.client_id = localStorage.getItem('LOGINID');
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
                        <div className="error-message">{error.client_name}</div>
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
                        <div className="error-message">{error.client_company}</div>
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
                        <div className="error-message">{error.job_name}</div>
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
                        <div className="error-message">{error.job_description}</div>
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
                        <div className="error-message">{error.budget}</div>
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
                            <div className="error-message">{error.start_date}</div>
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
                        <div className="error-message">{error.end_date}</div>
                    </div>

                    <WhiteButton text="Send" onClick={handleDoneClick} />
                    {/* <button onClick={handleDoneClick}>Send</button> */}
                </div>
            </div>
        </div>
    );
};

export default HireFreelancer;