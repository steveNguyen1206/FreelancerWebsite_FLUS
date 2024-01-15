import React from 'react';
import './admin_subcategory_add.css';
import exitButton from '../../assets/exitButton.png';
import { useState } from 'react';
import subcategoryService from '@/services/subcategoryService';

const AddSubcategory = ({ m_state, m_function, fetchFunction, categoryId }) => {
  const [newSubcategory, setnewSubcategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddSubcategory = () => {
      // call api to add subcategory
      const data = {
          subcategory_name: newSubcategory,
          categoryId: categoryId
        };
        console.log(data);
      subcategoryService
      .create(data, localStorage.getItem('AUTH_TOKEN'))
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

  const handleNewSubcategoryChange = (event) => {
    // remove invalid space in the input
    var content = event.target.value.trim();

    setnewSubcategory(content);
    console.log("New subcate: "+ newSubcategory);
  };

  return (
    <div className="cate-main-container">
      <div className="pop-up-edit-category">
        <div className="editcategory-wrapper">
          <div className="navigation">
            <div className="header-popup-text">Add Subcategory</div>
            <img
              className="close-icon"
              src={exitButton}
              onClick={handleCloseIconClick}
            />
          </div>

          <div className="cate-info-field">
            {/* Add new subcategory */}
            <div className="input-container">
              <label for="inputNewSubcategory" class="form-label">
                New Subcategory
              </label>
              <input
                id="inputNewSubcategory"
                name="newSubcategory"
                type="text"
                class="form-control"
                aria-label="newSubcategory"
                aria-describedby="basic-addon1"
                onChange={handleNewSubcategoryChange}
              />
            </div>

            <div className="save-category-button" onClick={handleAddSubcategory}>
              <div className="div-wrapper">Save</div>
            </div>

            <div className="err-mesage"> {errorMessage} </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubcategory;
