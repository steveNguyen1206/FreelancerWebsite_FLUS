import React from 'react';
import './admin_category_edit.css';
import exitButton from '../../assets/exitButton.png';
import categoryService from '@/services/categoryService';
import { useState } from 'react';

const EditCategory = ({ m_state, m_function, fetchFunction, category }) => {
  const [Category, setCategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEditCategory = () => {
    if (category.name === Category) {
      setErrorMessage('New name can not same as current name');
    } else {
      // call api to edit category
      const data = {
        name: Category,
        id: category.id,
      };
      console.log(data);
      categoryService
        .update(data, localStorage.getItem('AUTH_TOKEN'))
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
    }
  };

  const handleDeleteCategory = () => {
    // call api to delete category
    const data = {
      id: category.id,
    };

    console.log(data);

    // .delete(data)
    categoryService
      .deleteCategory(category.id, localStorage.getItem('AUTH_TOKEN'))
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
  }

  const handleCloseIconClick = () => {
    m_function(false);
  };

  const handleCategoryChange = (event) => {
    // remove invalid space in the input
    setCategory(event.target.value.trim());
    console.log('Cate: ' + Category);
  };

  return (
    <div className="cate-main-container">
      <div className="pop-up-edit-category">
        <div className="editcategory-wrapper">
          <div className="navigation">
            <div className="header-popup-text">Edit category</div>
            <img
              className="close-icon"
              src={exitButton}
              onClick={handleCloseIconClick}
            />
          </div>

          <div className="cate-info-field">
            {/* Current name */}
            <div className="current-name">Current category: {category.name}</div>

            {/* Category name */}
            <div className="input-container">
              <label for="editCategory" class="form-label">
                Change Category Name
              </label>
              <input
                id="editCategory"
                name="editCategory"
                type="text"
                class="form-control"
                aria-label="editCategory"
                aria-describedby="basic-addon1"
                onChange={handleCategoryChange}
              />
            </div>

            <div className='col-buttons'>
              <div className="delete-category-button" onClick={handleDeleteCategory}>
                <div className="div-wrapper">Delete</div>
              </div>
              
              <div className="save-category-button" onClick={handleEditCategory}>
                <div className="div-wrapper">Save</div>
              </div>
            </div>

            <div className="err-mesage"> {errorMessage} </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
