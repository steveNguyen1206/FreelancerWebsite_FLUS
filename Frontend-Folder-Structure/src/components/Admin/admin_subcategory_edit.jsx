import React from 'react';
import './admin_subcategory_edit.css';
import exitButton from '../../assets/exitButton.png';
import { useState } from 'react';
import subcategoryService from '@/services/subcategoryService';

const EditSubcategory = ({
  m_state,
  m_function,
  fetchFunction,
  subcategory,
}) => {
  const [Subcategory, setSubcategory] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEditSubcategory = (event) => {
    // call api to update subcategory
    const data = {
      subcategory_name: Subcategory,
      id: subcategory.id,
    };
    console.log(data);
    subcategoryService
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
  };

  const handleDeleteSubcategory = (event) => {
    // call api to update subcategory
    // const data = {
    //     subcategory_name: Subcategory,
    //     id: subcategory.id
    //   };
    //   console.log(data);
    subcategoryService
      .deleteSubcategory(subcategory.id, localStorage.getItem('AUTH_TOKEN'))
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

  const handleSubcategoryChange = (event) => {
    // remove invalid space in the input
    setSubcategory(event.target.value.trim());
    console.log('Cate: ' + Category);
  };

  return (
    <div className="cate-main-container">
      <div className="pop-up-edit-category">
        <div className="editcategory-wrapper">
          <div className="navigation">
            <div className="header-popup-text">Edit Subcategory</div>
            <img
              className="close-icon"
              src={exitButton}
              onClick={handleCloseIconClick}
            />
          </div>

          <div className="cate-info-field">
            {/* Current name */}
            <div className="current-name">
              Current subcategory: {subcategory.subcategory_name}
            </div>

            {/* Change subcategory name */}
            <div className="input-container">
              <label for="inputNewSubcategory" class="form-label">
                Change Subcategory Name
              </label>
              <input
                id="inputNewSubcategory"
                name="newSubcategory"
                type="text"
                class="form-control"
                aria-label="newSubcategory"
                aria-describedby="basic-addon1"
                onChange={handleSubcategoryChange}
              />
            </div>

            <div className="col-buttons">
              <div
                className="delete-category-button"
                onClick={handleDeleteSubcategory}
              >
                <div className="div-wrapper">Delete</div>
              </div>

              <div
                className="save-category-button"
                onClick={handleEditSubcategory}
              >
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

export default EditSubcategory;
