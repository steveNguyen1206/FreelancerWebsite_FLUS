import React, { useState } from 'react';
import userDataService from '@/services/userDataServices';
import { useParams } from 'react-router-dom';
import { UpdateButton } from '@/components';
import './updateAvatarForm.css';

const UpdateAvatarForm = () => {
  const { userId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (selectedFile) {
      userDataService
        .updateAvatar(userId, selectedFile)
        .then((response) => {
          // Handle the response data
          setSuccessMessage('Upload successfully');
        })
        .catch((error) => {
          // Handle any errors
          setErrorMessage(error.message);
        });
    }
    else {
      setErrorMessage('Please select a file to upload');
    }
  };

  return (
    <div className="update-avatar-selection">
      <div className="update-avatar-buttons">
        <input
          className="chose-file-button"
          type="file"
          onChange={handleFileChange}
        />
        <UpdateButton button_name={'Update Avatar'} onClick={handleUpload} />
      </div>
      <div className="error-message">{errorMessage}</div>
      <div className="success-message">{successMessage}</div>
    </div>
  );
};

export default UpdateAvatarForm;
