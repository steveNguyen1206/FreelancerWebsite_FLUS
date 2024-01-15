import React from 'react';
import './update_name_contacts.css';
import { useState } from 'react';
import { EditTextField, UpdateButton } from '@/components';
import userDataService from '@/services/userDataServices';

const UpdateNameContacts = ({ user_id }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // handle profile name change
  const [profileName, setProfileName] = useState('');

  const handleProfileNameChange = (e) => {
    setProfileName(e.target.value);
  };

  // handle social link change
  const [socialLink, setSocialLink] = useState('');

  const handleSocialLinkChange = (e) => {
    setSocialLink(e.target.value);
  };

  // handle save name & contacts
  const handleSaveNameContacts = () => {
    setErrorMessage('');
    setSuccessMessage('');

    // create object from unempty fields
    const fields = {};
    
    if (profileName) fields['profile_name'] = profileName.trim();
    if (socialLink) fields['social_link'] = socialLink.trim();

    // check if object is empty
    if (Object.keys(fields).length === 0) {
      setErrorMessage('Please fill in at least one field.');
      return;
    }

    // call API to update name & contacts
    userDataService.updateNameAndSocialLink({id: user_id, data: fields})
      .then((response) => {
        setSuccessMessage('Updated successfully');
      })
      .catch((error) => {
        setErrorMessage('Something went wrong. Please try again.');
      });
  };

  return (
    // <EditTextField field_name={"Account Name"} onChange={handleAccountNameChange}/>
    <div className='update-part-container'>
      <div className='title'>Name & Contacts</div>

      <div className='fields'>
        <EditTextField field_name={"Profile Name"} onChange={handleProfileNameChange}/>
        <EditTextField field_name={"Social Link"} onChange={handleSocialLinkChange}/>
      </div>

      <div className="error-message">{errorMessage}</div>
      <div className="success-message">{successMessage}</div>

      <UpdateButton className="update-button" button_name={"Save Name & Contacts"} onClick={handleSaveNameContacts}/>
    </div>
  );
};

export default UpdateNameContacts;
