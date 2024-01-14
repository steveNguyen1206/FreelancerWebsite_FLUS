import React from 'react';
import './EditTextField.css';

const EditTextField = ({ field_name, is_password = false, onChange }) => {
  const type = is_password ? 'password' : 'text';

  return (
    <div className='edit-text-container'>
      {/* Field name */}
      <div className='field-name'>{field_name}</div>

      {/* Input field box */}
      <input type={type} className='input-field' onChange={onChange} />
    </div>
  );
};

export default EditTextField;
