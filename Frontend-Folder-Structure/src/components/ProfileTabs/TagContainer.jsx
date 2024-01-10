import React from 'react';
import './TagContainer.css';
import { useState } from 'react';
import { EditTag } from '..';

const TagContainer = ({
  userId,
  list_tag,
  refreshFunction,
  errorMessage,
  successMessage,
}) => {
  return (
    <div className="tags-container">
      {list_tag.map((tag) => (
        <EditTag
          tag_name={tag.subcategory_name}
          tag_id={tag.id}
          user_id={userId}
          refreshFunction={refreshFunction}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      ))}
    </div>
  );
};

export default TagContainer;
