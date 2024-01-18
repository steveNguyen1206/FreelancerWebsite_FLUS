// import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import subcategoryService from '@/services/subcategoryService';
import { WhiteButton } from '@/components';
import './newPost.css';
// import './newPost.css';
import exitButton from '../../assets/exitButton.png';
import UploadIcon from '../../assets/UploadIcon.png';
import freelancer_post_Service from '@/services/freelancer_post_Service';
import { useParams } from 'react-router';

const isValidTitle = (title) => {
  return (title.length >= 10 && title.length <= 100) || title.length === 0;
};

const isValidAboutMe = (about_me) => {
  return (
    (about_me.length >= 10 && about_me.length <= 512) || about_me.length === 0
  );
};

const isValidDeliveryDescription = (delivery_description) => {
  return (
    (delivery_description.length >= 10 && delivery_description.length <= 512) ||
    delivery_description.length === 0
  );
};

const isValidSkillDescription = (skill_description) => {
  return (
    (skill_description.length >= 10 && skill_description.length <= 512) ||
    skill_description.length === 0
  );
};

const isValidLowestPrice = (lowset_price) => {
  if (lowset_price === '') return true;
  const lowestPriceRegex = /^[0-9]*$/;
  return lowestPriceRegex.test(lowset_price) && lowset_price > 0;
};

const isValidDeliveryDue = (delivery_due) => {
  if (delivery_due === '') return true;
  const deliveryDueRegex = /^[0-9]*$/;
  return deliveryDueRegex.test(delivery_due) && delivery_due >= 0;
};

const isValidRevisionNumber = (revision_number) => {
  if (revision_number === '') return true;
  const revisionNumberRegex = /^[0-9]*$/;
  return revisionNumberRegex.test(revision_number) && revision_number >= 0;
};

const UpdatePost = ({ isOpen, onClose, onUpdate }) => {
  const userId = localStorage.getItem('LOGINID');
  const currentURL = window.location.href;
  const postId = currentURL.split('/').pop();
  const initState = {
    freelancer_id: userId,
    title: '',
    delivery_description: '',
    about_me: '',
    skill_description: '',
    lowset_price: '',
    delivery_due: '',
    imgage_post_urls: '',
    skill_tag: '',
    revision_number: '',
    image_file: null, // Lấy file ảnh luôn
    id: postId,
  };
  const [updatePost, setUpdatePost] = useState(initState);

  const [showOverlay, setShowOverlay] = useState(isOpen);
  const [error, setError] = useState({
    title: '',
    image: '',
    about_me: '',
    delivery_description: '',
    skill_description: '',
    lowset_price: '',
    delivery_due: '',
    revision_number: '',
  });

  // console.log("initState: ", initState);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...error };

    if (!isValidTitle(updatePost.title)) {
      newErrors.title =
        'Title is invalid. Title must be between 10 and 100 characters.';
      isValid = false;
    } else {
      newErrors.title = '';
    }

    const file = updatePost.image_file;
    const allowedFormats = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/jpg',
      'image/webg',
    ];

    if (file && !allowedFormats.includes(file.type)) {
      newErrors.image = 'Image file not in supported format!';
      isValid = false;
    } else newErrors.image = '';

    if (!isValidAboutMe(updatePost.about_me)) {
      newErrors.about_me =
        'About me is invalid. About me must be between 10 and 512 characters.';
      isValid = false;
    } else {
      newErrors.about_me = '';
    }

    if (!isValidDeliveryDescription(updatePost.delivery_description)) {
      newErrors.delivery_description =
        'Delivery description is invalid. Delivery description must be between 10 and 512 characters.';
      isValid = false;
    } else {
      newErrors.delivery_description = '';
    }

    if (!isValidSkillDescription(updatePost.skill_description)) {
      newErrors.skill_description =
        'Skill description is invalid. Skill description must be between 10 and 512 characters.';
      isValid = false;
    } else {
      newErrors.skill_description = '';
    }

    if (!isValidLowestPrice(updatePost.lowset_price)) {
      newErrors.lowset_price =
        'Lowest price is invalid. Lowest price must be numeric and greater than 0.';
      isValid = false;
    } else {
      newErrors.lowset_price = '';
    }

    if (!isValidDeliveryDue(updatePost.delivery_due)) {
      newErrors.delivery_due =
        'Delivery due is invalid. Delivery due must be numeric and greater than or equal to 0.';
      isValid = false;
    } else {
      newErrors.delivery_due = '';
    }

    if (!isValidRevisionNumber(updatePost.revision_number)) {
      newErrors.revision_number =
        'Revision number is invalid. Revision number must be numeric and greater than or equal to 0.';
      isValid = false;
    } else {
      newErrors.revision_number = '';
    }

    setError(newErrors);
    return isValid;
  };
  const initialSkills = [
    {
      id: '',
      subcategory_name: '',
    },
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
  };

  const [fileName, setFileName] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatePost({ ...updatePost, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    setUpdatePost({ ...updatePost, image_file: file });
  };

  // const data = {
  //   title: updatePost.title,
  //   delivery_description: updatePost.delivery_description,
  //   about_me: updatePost.about_me,
  //   image_file: updatePost.image_file,
  //   lowset_price: updatePost.lowset_price,
  //   skill_tag: updatePost.skill_tag,
  //   delivery_due: updatePost.delivery_due,
  //   skill_description: updatePost.skill_description,
  //   id: postId,
  // };
  // console.log("postId ------------------->", postId);
  // console.log("data ------------------->", data);

  const handleUpdateClick = async () => {
    if (validateForm()) {
      console.log('Done clicked.');
      updatePost.skill_tag = document.getElementById('filter').value;
      try {
        console.log('From validated successfully.');
        console.log('Update Post: ', updatePost);
        await freelancer_post_Service.updatePost(updatePost);
        // .then(() => {
        console.log('Form is valid. Post updated successfully.');
        setShowOverlay(false);
        onUpdate();
        if (onClose) {
          await onClose();
        }
      } catch (error) {
        // )
        console.error('Error submitting project:', error.message);
      }
    } else {
      console.log('Form has errors. Please fix them.');
    }
  };
  // };

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
          <p>UPDATE FREELANCER POST</p>
        </div>

        <div className="new-post-body">
          <div className="project-title-input">
            <label htmlFor="skillTag">Skill tag *</label>
            <select className="filter" id="filter" style={{ width: '650px' }}>
              <option value="" disabled defaultValue>
                Add skills
              </option>
              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.subcategory_name}
                </option>
              ))}
            </select>
            <div className="error-message">{error.title}</div>
          </div>

          <div className="add-image-input">
            <label htmlFor="addImage">Add Image</label>
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
              defaultValue={updatePost.title}
              onChange={handleInputChange}
            />
            <div className="error-message">{error.title}</div>
          </div>

          <div className="project-title-input">
            <label htmlFor="projectAboutMe">About Me *</label>
            <textarea
              type="text"
              id="projectAboutMe"
              name="about_me"
              placeholder="Describe yourself here..."
              defaultValue={updatePost.about_me}
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
              defaultValue={updatePost.skill_description}
              onChange={handleInputChange}
            />
            <div className="error-message">{error.detail}</div>
          </div>

          <div className="project-range-budget">
            <div className="post-budget-min-input">
              <label htmlFor="budgetMin">Lowest Price *</label>
              <input
                type="text"
                id="budgetMin"
                name="lowset_price"
                placeholder="Enter lowest price ..."
                defaultValue={updatePost.lowset_price}
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
                defaultValue={updatePost.delivery_due}
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
                defaultValue={updatePost.revision_number}
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
              defaultValue={updatePost.delivery_description}
              onChange={handleInputChange}
            />
            <div className="error-message">{error.delivery_description}</div>
          </div>
          <WhiteButton text="Update Project" onClick={handleUpdateClick} />
        </div>
      </div>
    </>
  );
};

export default UpdatePost;
