import React from 'react';
import './admin_category_add.css';
import exitButton from '../../assets/exitButton.png';
import categoryService from '@/services/categoryService';
import { useState } from 'react';

const AddCategory = ({ m_state, m_function, fetchFunction }) => {
  const initState = {
    name: '', // Tên category
    img: null // Lấy file ảnh luôn
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [newCategory, setNewCategory] = useState(initState);
  
  const handleCategoryNameChange = (event) => {
    // remove invalid space in the input
    const { name, value } = event.target;
    setNewCategory({...newCategory, [name]: value.trim()});
  };

  const handleFileChange = (event) => {
    setNewCategory({...newCategory, img: event.target.files[0]});
  };

  const handleAddCategory = (event) => {
      // call api to add category
    categoryService
      .create(newCategory)
      .then((response) => {
        console.log(response.data);

        // close the popup
        m_function(false);

        // refresh the page
        fetchFunction();
      })
      .catch((e) => {
        console.log(e);
        setErrorMessage(e.response.data.message); 
      });
  };

  const handleCloseIconClick = () => {
    m_function(false);
  };


  return (
    <div className="cate-main-container">
      <div className="pop-up-add-category">
        <div className="addcategory-wrapper">
          <div className="navigation">
            <div className="header-popup-text">New category</div>
            <img
              className="close-icon"
              src={exitButton}
              onClick={handleCloseIconClick}
            />
          </div>

          <div className="cate-info-field">
            <div className="input-container">
              <label for="inputCategory" class="form-label">
                Category Name
              </label>
              <input
                id="inputCategory"
                name="name"
                type="text"
                class="form-control"
                aria-label="CategoryName"
                aria-describedby="basic-addon1"
                onChange={handleCategoryNameChange}
              />
            </div>

            <div className="input-container">
              <label for="inputCategory" class="form-label">
                Category Image
              </label>
              <input name='img' className="chose-category-image" type="file" onChange={handleFileChange} />
            </div>

            <div className="add-category-button" onClick={handleAddCategory}>
              <div className="div-wrapper">Add</div>
            </div>

            <div className="err-mesage"> {errorMessage} </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
