import React, { useState, useEffect } from 'react';
import { WhiteButton } from '@/components';
import './approveOffer.css';
import exitButton from '../../assets/exitButton.png';
import UploadIcon from '../../assets/UploadIcon.png';
import freelancer_post_Service from '@/services/freelancer_post_Service';
import subcategoryService from '@/services/subcategoryService';
import userDataService from '@/services/userDataServices';

// const isValidTitle = (title) => {
//   if (!title) return false;
//   const titleRegex = /^[a-zA-Z0-9\s]*$/;
//   return titleRegex.test(title);
// };

// const isValidDetail = (detail) => {
//   const detailRegex = /^.{10,}$/;
//   return detailRegex.test(detail);
// };

// const isValidBudget = (budget) => {
//   if (budget === '') return false;
//   const budgetRegex = /^[0-9]*$/;
//   return budgetRegex.test(budget) && budget > 0;
// };

// const isValidTag = (tag) => {
//   if (!tag) return false;
//   const tagRegex = /^[a-zA-Z0-9\s/\\]*$/;
//   return tagRegex.test(tag);
// };

const ApproveOffer = ({ isOpen, onClose, onUpdate }) => {
    const [showOverlay, setShowOverlay] = useState(isOpen);

    // const [error, setError] = useState({
    //   title: '',
    //   image: '',
    //   detail: '',
    //   budgetMin: '',
    //   budgetMax: '',
    //   tag: '',
    // });

    const [error, setError] = useState({

    });


    // const initState = {
    //   title: '',
    //   image: '',
    //   detail: '',
    //   budgetMin: '',
    //   budgetMax: '',
    //   tag: '',
    // };

    const initState = {
        about_me: '',
        skill_description: '',
        lowset_price: '',
        delivery_due: '',
        imgage_post_urls: '',
        skill_tag: '',
        image_file: null // Lấy file ảnh luôn
    };

    const validateForm = () => {
        let isValid = true;
        return isValid;
    };

    const [newPost, setNewPost] = useState(initState);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewPost({ ...newPost, [name]: value });
        // console.log(newPost);
    };
    console.log("mèo méo meo mèo meo")
    const handleDoneClick = () => {
        console.log('Done clicked.');
        newPost.skill_tag = document.getElementById("filter").value;
        if (validateForm()) {
            console.log("From validated successfully.")
            console.log(newPost)
            freelancer_post_Service
                .sendPost(newPost)
                .then(() => {
                    console.log('Form is valid. Post submitted successfully.');
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

    };





    return (
        <>
            {showOverlay && <div className="overlay" />}
            <div className="approve-offer-form">
                <button
                    onClick={() => {
                        setShowOverlay(false);
                        onClose();
                    }}
                    className="exit-button"
                >
                    <img src={exitButton} alt="Exit" />
                </button>
                <div className="approve-offer-header">
                    <p>Approve Offer</p>
                </div>

                <div className="approve-offer-body">
                    <div className="project-title-input">
                        <label htmlFor="projectTitle">Project Name*</label>
                        <input
                            type="text"
                            id="projectTitle"
                            name="project_name"
                            placeholder="Show project name..."
                        // defaultValue={newPost.about_me}
                        // onChange={handleInputChange}
                        />
                        <div className="error-message">{error.title}</div>
                    </div>

                    <div className="project-detail-input">
                        <label htmlFor="projectDetail">Project description *</label>
                        <textarea
                            type="text"
                            id="projectDetail"
                            name="project_description"
                            placeholder="Show project description here..."
                        // defaultValue={newPost.skill_description}
                        // onChange={handleInputChange}
                        />
                        <div className="error-message">{error.detail}</div>
                    </div>

                    <div className="project-title-input">
                        <label htmlFor="projectBudget">Budget*</label>
                        <input
                            type="text"
                            id="projectBudget"
                            name="budget"
                            placeholder="Show budget here..."
                        // defaultValue={newPost.about_me}
                        // onChange={handleInputChange}
                        />
                        <div className="error-message">{error.title}</div>
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
                            // onChange={handleInputChange}
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
                            // defaultValue={newPost.skill_description}
                            // onChange={handleInputChange}
                            />
                            <div className="error-message">{error.detail}</div>
                        </div>
                    </div>
                    {/* <button onClick={handleDoneClick}>Done</button> */}

                    <div className="accept-reject">
                        <WhiteButton className='rejectButton' text="Reject" />
                        <WhiteButton option="acceptButton" text="Accept" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ApproveOffer;