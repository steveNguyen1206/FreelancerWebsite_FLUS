import React, { useState, useEffect } from 'react';
import { WhiteButton } from '@/components';
import './updateProjectPost.css';
import exitButton from '../../assets/exitButton.png';
import UploadIcon from '../../assets/UploadIcon.png';
import projectPostServices from '@/services/projectPostServices';
import subcategoryService from '@/services/subcategoryService';

const isValidTitle = (title) => {
  if (!title) return true;
  if (!title) return true;
  const titleRegex = /^[a-zA-Z0-9\s]*$/;
  return titleRegex.test(title);
};

const isValidDate = (date) => {
  if (date == '') return true;
  const dateRegex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
  const currentDate = new Date();
  //input date is yyyy/mm/dd
  const inputDate = new Date(date);
  return currentDate.getTime() <= inputDate.getTime() && dateRegex.test(date);
};

const isValidDetail = (detail) => {
  if (!detail) return true;
  if (!detail) return true;
  const detailRegex = /^.{10,}$/;
  return detailRegex.test(detail);
};

const isValidBudget = (budget) => {
  if (!budget) return true;
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

const UpdateProject = ({ isOpen, onClose, projectId, onUpdate }) => {
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

  const [fileName, setFileName] = useState('');
  const [updateProject, setUpdateProject] = useState(initState);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdateProject({ ...updateProject, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    console.log(file);
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
    newErrors.tag_id = '';
    newErrors.startDate = '';

    let isValid = true;

    if (!isValidTitle(updateProject.projectTitle)) {
      newErrors.title =
        'Invalid title. Title must be alphanumeric and not empty.';
      isValid = false;
    }

    if (!isValidImage(updateProject.image)) {
      newErrors.image = 'Please select an image.';
      isValid = false;
    }else{
      const file = updateProject.image;
      const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webg'];

      if (file && !allowedFormats.includes(file.type)) {
        newErrors.image = 'Image file not in supported format!';
        isValid = false;
      }
    }

    if (!isValidDetail(updateProject.detail)) {
      newErrors.detail = 'Project detail must have at least 10 characters.';
      isValid = false;
    }

    if (!isValidDate(updateProject.startDate)) {
      newErrors.startDate = 'Invalid date. Please enter a valid date.';
      isValid = false;
    }

    if (!isValidTag(updateProject.tag_id)) {
      newErrors.tag_id = 'Project tag must be not empty.';
      isValid = false;
    }

    if (Number(updateProject.budgetMin) > Number(updateProject.budgetMax)) {
      newErrors.budgetMin =
        'Invalid budget. Minimum budget must be less than maximum budget.';
      newErrors.budgetMax =
        'Invalid budget. Maximum budget must be greater than minimum budget.';
      isValid = false;
    } else if (!isValidBudget(updateProject.budgetMin)) {
      newErrors.budgetMin =
        'Invalid budget. Please enter a valid number greater than 0.';
      isValid = false;
    } else if (!isValidBudget(updateProject.budgetMax)) {
      newErrors.budgetMax =
        'Invalid budget. Please enter a valid number greater than 0.';
      isValid = false;
    } else {
      newErrors.budgetMin = '';
      newErrors.budgetMax = '';
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
    tag_id: updateProject.tag_id,
    startDate: updateProject.startDate,
    id: projectId,
  };

  const handleUpdateClick = async () => {
    if (validateForm()) {
      console.log(data);
      try {
        await projectPostServices.update(
          data,
          localStorage.getItem('AUTH_TOKEN')
        );
        console.log('Form is valid. Project submitted successfully.');
        setShowOverlay(false);
        onUpdate();
        if (onClose) {
          await onClose();
        }
      } catch (error) {
        console.error('Error submitting project:', error.message);
      }
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

          <div id="project-tag-and-date">
            <div className="project-tag-input-1">
              <label htmlFor="projectTag">Project Tag *</label>
              <select
                id="projectTag"
                name="tag_id"
                value={updateProject.tag_id}
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
                value={updateProject.startDate}
                onChange={handleInputChange}
              />
              <div className="error-message">{error.startDate}</div>
            </div>
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

          <div className="project-range-budget-1">
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

          <WhiteButton text="Update Project" onClick={handleUpdateClick} />
        </div>
      </div>
    </>
  );
};

export default UpdateProject;
