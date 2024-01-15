import React, { useState, useEffect } from 'react';
import { WhiteButton } from '@/components';
import './newProjectPost.css';
import exitButton from '../../assets/exitButton.png';
import UploadIcon from '../../assets/UploadIcon.png';
import projectPostServices from '@/services/projectPostServices';
import subcategoryService from '@/services/subcategoryService';

const isValidTitle = (title) => {
  if (!title) return false;
  const titleRegex = /^[a-zA-Z0-9\s]*$/;
  return titleRegex.test(title);
};

const isValidDetail = (detail) => {
  const detailRegex = /^[\p{P}\p{L}\s]{10,}$/gu;
  return detailRegex.test(detail);
};

const isValidBudget = (budget) => {
  if (budget === '') return false;
  const budgetRegex = /^[0-9]*$/;
  return budgetRegex.test(budget) && budget > 0;
};

const isValidTag = (tag) => {
  if (!tag) return false;
  return true;
};

const isValidDate = (date) => {
  if (date == '') return false;
  const dateRegex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
  const currentDate = new Date();
  //input date is yyyy/mm/dd
  const inputDate = new Date(date);
  return currentDate.getTime() <= inputDate.getTime() && dateRegex.test(date);
};

const NewProjectPost = ({ isOpen, onClose, onUpdate }) => {
  const [showOverlay, setShowOverlay] = useState(isOpen);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getTags();
  }, []);

  const getTags = () => {
    subcategoryService
      .findAll()
      .then((response) => {
        setTags(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const [error, setError] = useState({
    title: '',
    image: '',
    detail: '',
    budgetMin: '',
    budgetMax: '',
    tag_id: '',
    startDate: '',
  });

  const initState = {
    title: '',
    image: '',
    detail: '',
    budgetMin: '',
    budgetMax: '',
    tag_id: '',
    startDate: '',
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...error };

    // Validate title
    if (!isValidTitle(newProject.title)) {
      newErrors.title =
        'Invalid title. Title must be alphanumeric and not empty.';
      isValid = false;
    } else {
      newErrors.title = '';
    }

    // Validate image
    if (!newProject.image) {
      newErrors.image = 'Please select an image.';
      isValid = false;
    } else {
      newErrors.image = '';
    }

    // Validate tag
    if (!isValidTag(newProject.tag_id)) {
      newErrors.tag_id = 'Project tag must not be empty.';
      isValid = false;
    } else {
      newErrors.tag_id = '';
    }

    if (!isValidDate(newProject.startDate)) {
      newErrors.startDate = 'Date must be in the future.';
      isValid = false;
    } else {
      newErrors.startDate = '';
    }

    // Validate detail
    if (!isValidDetail(newProject.detail)) {
      newErrors.detail = 'Project detail must have at least 10 characters.';
      isValid = false;
    } else {
      newErrors.detail = '';
    }

    if (Number(newProject.budgetMin) > Number(newProject.budgetMax)) {
      newErrors.budgetMin =
        'Invalid budget. Minimum budget must be less than maximum budget.';
      newErrors.budgetMax =
        'Invalid budget. Maximum budget must be greater than minimum budget.';
      isValid = false;
    } else if (!isValidBudget(newProject.budgetMin)) {
      newErrors.budgetMin =
        'Invalid budget. Please enter a valid number greater than 0.';
      isValid = false;
    } else if (!isValidBudget(newProject.budgetMax)) {
      newErrors.budgetMax =
        'Invalid budget. Please enter a valid number greater than 0.';
      isValid = false;
    } else {
      newErrors.budgetMin = '';
      newErrors.budgetMax = '';
    }

    setError(newErrors);
    return isValid;
  };

  const [fileName, setFileName] = useState('');
  const [newProject, setNewProject] = useState(initState);
  const [errorMessage, setErrorMessage] = useState('');

  console.log(newProject)

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    setNewProject({ ...newProject, image: file });
  };

  const handleDoneClick = () => {
    if (validateForm()) {
      projectPostServices
        .create(newProject, localStorage.getItem('AUTH_TOKEN'))
        .then(() => {
          console.log('Form is valid. Project submitted successfully.');
          setShowOverlay(false);
          onUpdate();
          if (onClose) {
            onClose();
          }
        })
        .catch((error) => {
          // if status code is 401 or 403, display error message
          if (error.response.status === 401 || error.response.status === 403) {
            setErrorMessage("Please login to create a project post");
          } else {
            setErrorMessage(
              'Error submitting project. Please try again later.'
            );
          }
        });
    } else {
      console.log('Form has errors. Please fix them.');
    }
  };

  return (
    <>
      {showOverlay && <div className="overlay" />}
      <div className="new-project-form-1">
        <button
          onClick={() => {
            setShowOverlay(false);
            onClose();
          }}
          className="exit-button"
        >
          <img src={exitButton} alt="Exit" />
        </button>
        <div className="new-project-header-1">
          <p>NEW PROJECT POST</p>
        </div>

        <div className="new-project-body-1">
          <div className="project-title-input-1">
            <label htmlFor="projectTitle">Project Title *</label>
            <input
              type="text"
              id="projectTitle"
              name="title"
              placeholder="Enter project title ..."
              value={newProject.title}
              onChange={handleInputChange}
            />
            <div className="error-message">{error.title}</div>
          </div>
          <div className="add-image-input-1">
            <label htmlFor="addImage">Add Image *</label>
            <div className="add-image-container-1">
              <div className="file-input-container-1">
                <img
                  className="upload-icon"
                  src={UploadIcon}
                  alt="Upload Icon"
                />
                <div className="file-input-text-1">
                  <p>
                    Drag & drop files <span className="browse-text-1">or</span>
                    <label htmlFor="fileInput" className="browse-label-1">
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
                  {fileName && <p className="file-name-1">{fileName}</p>}
                </div>
              </div>
              <p className="supported-formats-1">
                Supported formats: JPEG, PNG, JPG
              </p>
            </div>
            <div className="error-message">{error.image}</div>
          </div>
          <div className="project-detail-input-1">
            <label htmlFor="projectDetail">Project Detail *</label>
            <textarea
              type="text"
              id="projectDetail"
              name="detail"
              placeholder="Enter project details ..."
              value={newProject.detail}
              onChange={handleInputChange}
            />
            <div className="error-message">{error.detail}</div>
          </div>

          <div id="project-tag-and-date">
            <div className="project-tag-input-1">
              <label htmlFor="projectTag">Project Tag *</label>
              <select
                id="projectTag"
                name="tag_id"
                value={newProject.tag_id}
                onChange={handleInputChange}
              >
                <option value="">Select a tag</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.subcategory_name}
                  </option>
                ))}
              </select>
              <div className="error-message">{error.tag_id}</div>
            </div>

            <div id="start-date-project">
              <label htmlFor="startDate">Start Date *</label>
              <input
                type="text"
                id="startDate"
                name="startDate"
                placeholder="Start date: yyyy/mm/dd"
                value={newProject.startDate}
                onChange={handleInputChange}
              />
              <div className="error-message">{error.startDate}</div>
            </div>
          </div>

          <div className="project-range-budget-1">
            <div className="budget-min-input-1">
              <label htmlFor="budgetMin">Budget Min *</label>
              <input
                type="text"
                id="budgetMin"
                name="budgetMin"
                placeholder="Enter minimum budget ..."
                value={newProject.budgetMin}
                onChange={handleInputChange}
              />
              <div className="error-message">{error.budgetMin}</div>
            </div>

            <div className="budget-max-input-1">
              <label htmlFor="budgetMax">Budget Max *</label>
              <input
                type="text"
                id="budgetMax"
                name="budgetMax"
                placeholder="Enter maximum budget ..."
                value={newProject.budgetMax}
                onChange={handleInputChange}
              />
              <div className="error-message">{error.budgetMax}</div>
            </div>
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <WhiteButton text="Done" onClick={handleDoneClick} />
        </div>
      </div>
    </>
  );
};

export default NewProjectPost;
