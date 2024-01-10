import React, { useState, useEffect } from 'react';
import { WhiteButton } from '@/components';
import './newPost.css';
import exitButton from '../../assets/exitButton.png';
import UploadIcon from '../../assets/UploadIcon.png';
import projectServices from '@/services/projectPostServices';
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

const NewPost = ({ isOpen, onClose, onUpdate }) => {
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

  const initState = {
    title: '',
    delivery_description: '',
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
  const initialSkills = [
    {
      'id': '',
      'subcategory_name': ''
    }
  ];
  const [skills, setSkills] = useState(initialSkills);
  useEffect(() => {
    getSkills();
  }, []);

  const getSkills = () => {
    subcategoryService
      .findAll()
      .then((response) => {
        setSkills(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const [fileName, setFileName] = useState('');
  const [newPost, setNewPost] = useState(initState);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPost({ ...newPost, [name]: value });
    // console.log(newPost);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    setNewPost({ ...newPost, image_file: file });
  };

  const [selectedFile, setSelectedFile] = useState(null);

  // const handleFileChange = (event) => {
  //   setSelectedFile(event.target.files[0]);
  // };
  
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

    // if (selectedFile) {
    //   const userId = 1;
    //   userDataService.updateAvatar(userId, selectedFile)
    //       .then(response => {
    //           // Handle the response data
    //           console.log(response);
    //           console.log("ameomeo")
    //       })
    //       .catch(error => {
    //           // Handle any errors
    //           console.error(error);
    //           console.log("ahuhu")

    //       });
    //     }
  };





  return (
    <>
      {showOverlay && <div className="overlay" />}
      <div className="new-project-form">
        <button
          onClick={() => {
            setShowOverlay(false);
            onClose();
          }}
          className="exit-button"
        >
          <img src={exitButton} alt="Exit" />
        </button>
        <div className="new-project-header">
          <p>NEW POST</p>
        </div>

        <div className="new-post-body">

        <div className="project-title-input">
            <label htmlFor="skillTag">Skill tag *</label>
            <select className="filter" id="filter" style={{width: '650px'}}>
                <option value="" disabled defaultValue>
                  Add skills
                </option>
                {skills.map(skill => (
                  <option key={skill.id} value={skill.id}>
                    {skill.subcategory_name}
                  </option>
                ))}
              </select>
            <div className="error-message">{error.title}</div>
          </div>

          <div className="add-image-input">
            <label htmlFor="addImage">Add Image *</label>
            <div className="add-image-container">
              <div className="file-input-container">
                <img
                  className="upload-icon"
                  src={UploadIcon}
                  alt="Upload Icon"
                />
                <div className="file-input-text">
                  <p>
                    Drag & drop files <span className="browse-text">or</span>
                    <label htmlFor="fileInput" className="browse-label">
                      Browse
                    </label>
                  </p>
                  <input
                    type="file"
                    id="fileInput"
                    name="image"
                    accept="image/*"
                    style={{ display: 'none' }}
                    defaultValue={newPost.image_file}
                    onChange={handleFileChange}
                  />
                  {fileName && <p className="file-name">{fileName}</p>}
                </div>
              </div>
              <p className="supported-formats">
                Supported formats: JPEG, PNG, JPG
              </p>
            </div>
            <div className="error-message">{error.image}</div>
          </div>

          <div className="project-title-input">
            <label htmlFor="projectTitle">Post's Title *</label>
            <input
              type="text"
              id="projectTitle"
              name="title"
              placeholder="Post's title"
              defaultValue={newPost.title}
              onChange={handleInputChange}
            />
            <div className="error-message">{error.title}</div>
          </div>

          <div className="project-title-input">
            <label htmlFor="projectAboutMe">About Me *</label>
            <input
              type="text"
              id="projectAboutMe"
              name="about_me"
              placeholder="Describe yourself here..."
              defaultValue={newPost.about_me}
              onChange={handleInputChange}
            />
            <div className="error-message">{error.title}</div>
          </div>
          
          <div className="project-detail-input">
            <label htmlFor="projectDetail">About My Skill *</label>
            <textarea
              type="text"
              id="projectDetail"
              name="skill_description"
              placeholder="Describe your skill here..."
              defaultValue={newPost.skill_description}
              onChange={handleInputChange}
            />
            <div className="error-message">{error.detail}</div>
          </div>
          {/* <div className="project-tag-input">
            <label htmlFor="projectTag">Project Tag *</label>
            <input
              type="text"
              id="projectTag"
              name="tag"
              placeholder="Enter project tag ..."
              value={newProject.tag}
              onChange={handleInputChange}
            />
            <div className="error-message">{error.tag}</div>
          </div> */}
          <div className="post-range-budget">
            <div className="post-budget-min-input">
              <label htmlFor="budgetMin">Lowest Price *</label>
              <input
                type="text"
                id="budgetMin"
                name="lowset_price"
                placeholder="Enter lowest price ..."
                defaultValue={newPost.lowset_price}
                onChange={handleInputChange}
              />
              <div className="error-message">{error.budgetMin}</div>
            </div>

            <div className="post-budget-min-input">
              <label htmlFor="deliveryDue">Delivery due *</label>
              <input
                type="text"
                id="deliveryDue"
                name="delivery_due"
                placeholder="Enter delivery due ..."
                defaultValue={newPost.delivery_due}
                onChange={handleInputChange}
              />
              <div className="error-message">{error.delivery_due}</div>
            </div>
            <div className="post-budget-min-input">
              <label htmlFor="revisionNum">Revision Number</label>
              <input
                type="numeric"
                id="revisionNum"
                name="revision_number"
                placeholder="Enter revision number ..."
                defaultValue={newPost.revision_number}
                onChange={handleInputChange}
              />
              <div className="error-message">{error.revision_number}</div>
            </div>
          </div>
          <div className="project-title-input">
            <label htmlFor="projectDeliverDescript">Delivery Description</label>
            
            <textarea
              type="text"
              id="projectDeliverDescript"
              name="delivery_description"
              placeholder="Write more about how your products come to the client. Each line will be a list's item."
              defaultValue={newPost.delivery_description}
              onChange={handleInputChange}
            />
            <div className="error-message">{error.delivery_description}</div>
          </div>
          <button className='done-button' onClick={handleDoneClick}>Done</button>
        </div>
      </div>
    </>
  );
};

export default NewPost;