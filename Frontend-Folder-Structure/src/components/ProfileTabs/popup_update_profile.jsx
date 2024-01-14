import React from 'react';
import './popup_update_profile.css';
import { RedCloseButton } from '@/components';
import { UpdateAvartar, UpdateTags, UpdatePassword, UpdateNameContacts} from '@/components';

const PopupUpdateProfile = ({ user_profile, handleCloseIconClick }) => {
  // user_profile: user profile data, with:
    // id: '',
    // account_name: '',
    // profile_name: '',
    // phone_number: '',
    // nationality: '',
    // user_type: 0,
    // email: '',
    // avt_url: '',
    // social_link: '',

  const user_id = user_profile.id || null;

  return (
    <div className="update-profile-container">
      <div className="popup-update-profile">
        {/* Row 1: Button Close PopUp */}
        <div className="row close-popup-button">
          <RedCloseButton onClick={handleCloseIconClick} />
        </div>

        {/* Row 2: update avatar */}
        <div className='row'>
          <UpdateAvartar user_id={user_id} avt_url={user_profile.avt_url}/>
        </div>

        {/* Row 3: update other field */}
        <div className='multi-columns'>        
          {/* Column 3.1: Tags & Password*/}
          <div className='col split-to-two-row'>
            {/* Row 3.1.1: Tags*/}
            {/* if user_id != null to render UpdateTags */}

            {user_id && 
              (<div>
                <UpdateTags user_id={user_id}/>
              </div>)
            }
    
            {/* Row 3.1.2: Password */}
            <div>
              <UpdatePassword user_id={user_id}/>
            </div>
          </div>

          {/* Columns 3.2: Name & Contacts */}
          <div className='col'>
            <UpdateNameContacts user_id={user_id}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupUpdateProfile;
