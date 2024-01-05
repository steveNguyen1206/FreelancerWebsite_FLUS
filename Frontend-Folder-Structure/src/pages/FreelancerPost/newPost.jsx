import React, { useState, useEffect } from 'react';
import { WhiteButton } from '@/components';
import './newPost.css';
import exitButton from '../../assets/exitButton.png';
import UploadIcon from '../../assets/UploadIcon.png';
import projectServices from '@/services/projectPostServices';
import freelancer_post_Service from '@/services/freelancer_post_Service';
import subcategoryService from '@/services/subcategoryService';
import userDataService from '@/services/userDataServices';

const isValidTitle = (title) => {
  if (!title) return false;
  const titleRegex = /^[a-zA-Z0-9\s]*$/;
  return titleRegex.test(title);
};

const isValidAboutMe = (about_me) => {
  // const detailRegex = /^.{10,}$/;
  // return detailRegex.test(detail);
  const aboutMeRegex = /^[a-zA-Z0-9\s]*$/;  
  return aboutMeRegex.test(about_me);
};

const isValidDeliveryDescription = (delivery_description) => {
  const descriptionRegex = /^[a-zA-Z0-9]{1,511}$/;
  return descriptionRegex.test(delivery_description);
};

const isValidSkillDescription = (skill_description) => {
  const skillRegex = /^[a-zA-Z0-9\s]{1,511}$/;
  return skillRegex.test(skill_description);
};

const isValidLowestPrice = (lowset_price) => {
  if (lowset_price === '') return false;
  const lowestPriceRegex = /^[0-9]*$/;
  return lowestPriceRegex.test(lowset_price) && lowset_price > 0;
};

const isValidDeliveryDue = (delivery_due) => {
  if (delivery_due === '') return false;
  const deliveryDueRegex = /^[0-9]*$/;
  return deliveryDueRegex.test(delivery_due) && delivery_due >= 0;
};

const isValidRevisionNumber = (revision_number) => {
  if (revision_number === '') return false;
  const revisionNumberRegex = /^[0-9]*$/;
  return revisionNumberRegex.test(revision_number) && revision_number >= 0;
};



const NewPost = ({ isOpen, onClose, onUpdate }) => {
  const userId = localStorage.getItem('LOGINID');
  const [showOverlay, setShowOverlay] = useState(isOpen);

  const [errors, setErrors] = useState({
    title: '',
    image: '',
    about_me: '',
    delivery_description: '',
    skill_description: '',
    lowset_price: '',
    delivery_due: '',
    revision_number: '',
  });

  const initState = {
    freelancer_id: userId,
    title: '',
    delivery_description: '',
    about_me: '',
    skill_description: '',
    lowset_price: '',
    delivery_due: '',
    revision_number: '',
    imgage_post_urls: '',
    skill_tag: '',
    image_file: null // Lấy file ảnh luôn
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {...errors};

    if (!isValidTitle(newPost.title)) {
      newErrors.title = 'Title is invalid. Title must be alphanumeric and not empty.';
      isValid = false;
    } else {
      newErrors.title = '';
    }

    if (!isValidAboutMe(newPost.about_me)) {
      newErrors.about_me = 'About me is invalid. About me must be alphanumeric and not empty.';
      isValid = false;
    } else {
      newErrors.about_me = '';
    }

    if (!isValidDeliveryDescription(newPost.delivery_description)) {
      newErrors.delivery_description = 'Delivery description is invalid. Delivery description must be alphanumeric and not empty.';
      isValid = false;
    } else {
      newErrors.delivery_description = '';
    }

    if (!isValidSkillDescription(newPost.skill_description)) {
      newErrors.skill_description = 'Skill description is invalid. Skill description must be alphanumeric and not empty.';
      isValid = false;
    } else {
      newErrors.skill_description = '';
    }

    if (!isValidLowestPrice(newPost.lowset_price)) {
      newErrors.lowset_price = 'Lowest price is invalid. Lowest price must be numeric and greater than 0.';
      isValid = false;
    } else {
      newErrors.lowset_price = '';
    }

    if (!isValidDeliveryDue(newPost.delivery_due)) {
      newErrors.delivery_due = 'Delivery due is invalid. Delivery due must be numeric and greater than or equal to 0.';
      isValid = false;
    }
    else {
      newErrors.delivery_due = '';
    }

    if (!isValidRevisionNumber(newPost.revision_number)) {
      newErrors.revision_number = 'Revision number is invalid. Revision number must be numeric and greater than or equal to 0.';
      isValid = false;
    } else {
      newErrors.revision_number = '';
    }

    setErrors(newErrors);
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
            <select className="filter" id="filter" style={{ width: '650px' }}>
              <option value="" disabled defaultValue>
                Add skills
              </option>
              {skills.map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.subcategory_name}
                </option>
              ))}
            </select>
            {/* <div className="error-message">{errors.title}</div> */}
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
            {/* <div className="error-message">{errors.}</div> */}
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
            <div className="error-message">{errors.title}</div>
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
            <div className="error-message">{errors.about_me}</div>
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
            <div className="error-message">{errors.skill_description}</div>
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
              <div className="error-message">{errors.lowset_price}</div>
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
              <div className="error-message">{errors.delivery_due}</div>
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
              <div className="error-message">{errors.revision_number}</div>
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
            <div className="error-message">{errors.delivery_description}</div>
          </div>
          <button className='done-button' onClick={handleDoneClick}>Done</button>
        </div>
      </div>
    </>
  );
};

export default NewPost;