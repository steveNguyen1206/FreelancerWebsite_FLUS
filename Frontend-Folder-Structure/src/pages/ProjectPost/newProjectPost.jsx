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
  const detailRegex = /^.{10,}$/;
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
  });

  const initState = {
    title: '',
    image: '',
    detail: '',
    budgetMin: '',
    budgetMax: '',
    tag_id: '',
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
        .sendProject(newProject)
        .then(() => {
          console.log('Form is valid. Project submitted successfully.');
          setShowOverlay(false);
          onUpdate();
          if (onClose) {
            onClose();
          }
        })
        .catch((error) => {
          setErrorMessage(error.message);
          console.error('Error submitting project:', error.message);
        });
    } else {
      console.log('Form has errors. Please fix them.');
    }
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
          <p>NEW PROJECT</p>
        </div>

        <div className="new-project-body">
          <div className="project-title-input">
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
          <div className="project-detail-input">
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
          <div className="project-tag-input">
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
          <div className="project-range-budget">
            <div className="budget-min-input">
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

            <div className="budget-max-input">
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