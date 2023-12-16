import React, { useState } from 'react';
import { WhiteButton } from '@/components';
import './updateproject.css';
import exitButton from '../../assets/exitButton.png';
import UploadIcon from '../../assets/UploadIcon.png';
import projectServices from '@/services/projectPostServices';

const isValidTitle = (title) => {
  if (!title) return true;
  const titleRegex = /^[a-zA-Z0-9\s]*$/;
  return titleRegex.test(title);
};

const isValidDetail = (detail) => {
  if (!detail) return true;
  const detailRegex = /^.{10,}$/;
  return detailRegex.test(detail);
};

const isValidBudget = (budget) => {
  if (!budget) return true;
  const budgetRegex = /^[0-9]*$/;
  return budgetRegex.test(budget) && budget > 0;
};

const isValidTag = (tag) => {
  if (!tag) return true;
  const tagRegex = /^[a-zA-Z0-9\s/\\]*$/;
  return tagRegex.test(tag);
};

const isValidImage = (image) => {
  return true;
};

const UpdateProject = ({ isOpen, onClose, projectId, onUpdate}) => {
  const [showOverlay, setShowOverlay] = useState(isOpen);
  const [error, setError] = useState({
    title: '',
    image: '',
    detail: '',
    budgetMin: '',
    budgetMax: '',
    tag: '',
  });

  const initState = {
    title: '',
    image: '',
    detail: '',
    budgetMin: '',
    budgetMax: '',
    tag: '',
  };

  const [fileName, setFileName] = useState('');
  const [updateProject, setUpdateProject] = useState(initState);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdateProject({ ...updateProject, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    setUpdateProject({ ...updateProject, image: file });
  };

  const validateForm = () => {
    const newErrors = { ...error };

    // Reset errors
    newErrors.title = '';
    newErrors.image = '';
    newErrors.detail = '';
    newErrors.budgetMin = '';
    newErrors.budgetMax = '';
    newErrors.tag = '';

    let isValid = true;

    if (!isValidTitle(updateProject.projectTitle)) {
      newErrors.title =
        'Invalid title. Title must be alphanumeric and not empty.';
      isValid = false;
    }

    if (!isValidImage(updateProject.image)) {
      newErrors.image = 'Please select an image.';
      isValid = false;
    }

    if (!isValidDetail(updateProject.detail)) {
      newErrors.detail = 'Project detail must have at least 10 characters.';
      isValid = false;
    }

    if (!isValidTag(updateProject.tag)) {
      newErrors.tag = 'Project tag must be a string.';
      isValid = false;
    }

    if (Number(updateProject.budgetMin) > Number(updateProject.budgetMax)) {
      newErrors.budgetMin =
        'Minimum budget must be less than or equal to maximum budget.';
      newErrors.budgetMax =
        'Minimum budget must be less than or equal to maximum budget.';
      isValid = false;
    }

    if (!isValidBudget(updateProject.budgetMin)) {
      isValid = false;
      newErrors.budgetMin =
        'Invalid budget. Please enter a valid number greater than or equal to 0.';
    }

    if (!isValidBudget(updateProject.budgetMax)) {
      isValid = false;
      newErrors.budgetMax =
        'Invalid budget. Please enter a valid number greater than or equal to 0.';
    }

    if (
      (updateProject.budgetMin || updateProject.budgetMax) &&
      (!updateProject.budgetMin || !updateProject.budgetMax)
    ) {
      newErrors.budgetMin =
        'Both minimum and maximum budget must be updated together.';
      newErrors.budgetMax =
        'Both minimum and maximum budget must be updated together.';
      isValid = false;
    }

    // if all fields are valid, isValid will be false
    let allFieldsEmpty = true;
    Object.keys(updateProject).forEach((key) => {
      if (updateProject[key]) allFieldsEmpty = false;
    });

    if (allFieldsEmpty) {
      newErrors.title = 'Please fill in at least one field.';
      isValid = false;
    }
    setError(newErrors);
    return isValid;
  };

  const data = {
    title: updateProject.title,
    image: updateProject.image,
    detail: updateProject.detail,
    budgetMin: updateProject.budgetMin,
    budgetMax: updateProject.budgetMax,
    tag: updateProject.tag,
    id: projectId,
  };

  const handleUpdateClick = () => {
    if (validateForm()) {
      console.log(data);
      projectServices
        .updateProject(data)
        .then(() => {
          console.log('Form is valid. Project submitted successfully.');
          setShowOverlay(false);
          onUpdate();
          if (onClose) {
            onClose();
          }
        })
        .catch((error) => {
          console.error('Error submitting project:', error.message);
        });
    } else {
      console.log('Form has errors. Please fix them.');
    }
  };

  return (
    <>
      {showOverlay && <div className="overlay" />}
      <div className="update-project-form">
        <button onClick={onClose} className="exit-button">
          <img src={exitButton} alt="Exit" />
        </button>
        <div className="update-project-header">
          <p>UPDATE PROJECT</p>
        </div>

        <div className="update-project-body">
          <div className="project-title-input">
            <label htmlFor="projectTitle">Project Title</label>
            <input
              type="text"
              id="projectTitle"
              name="title"
              placeholder="Enter project title ..."
              value={updateProject.title}
              onChange={handleInputChange}
            />
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

          <div className="project-tag-input">
            <label htmlFor="projectTag">Project Tag</label>
            <input
              type="text"
              id="projectTag"
              name="tag"
              placeholder="Enter project tag ..."
              value={updateProject.tag}
              onChange={handleInputChange}
            />
            <div className="error-message">{error.tag}</div>
          </div>

          <div className="project-detail-input">
            <label htmlFor="projectDetail">Project Detail</label>
            <textarea
              type="text"
              id="projectDetail"
              name="detail"
              placeholder="Enter project details ..."
              onChange={handleInputChange}
              value={updateProject.detail}
            />
            <div className="error-message">{error.detail}</div>
          </div>

          <div className="project-range-budget">
            <div className="budget-min-input">
              <label htmlFor="budgetMin">Budget Min</label>
              <input
                type="text"
                id="budgetMin"
                name="budgetMin"
                placeholder="Enter minimum budget ..."
                onChange={handleInputChange}
                value={updateProject.budgetMin}
              />
              <div className="error-message">{error.budgetMin}</div>
            </div>

            <div className="budget-max-input">
              <label htmlFor="budgetMax">Budget Max</label>
              <input
                type="text"
                id="budgetMax"
                name="budgetMax"
                placeholder="Enter maximum budget ..."
                onChange={handleInputChange}
                value={updateProject.budgetMax}
              />
              <div className="error-message">{error.budgetMax}</div>
            </div>
          </div>

          <WhiteButton name="Update Project" onClick={handleUpdateClick} />
        </div>
      </div>
    </>
  );
};

export default UpdateProject;
