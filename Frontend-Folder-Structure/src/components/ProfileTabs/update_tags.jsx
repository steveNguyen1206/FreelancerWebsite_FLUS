import './update_tags.css';
import React, { useState, useEffect } from 'react';
import { UpdateButton, TagContainer } from '@/components';
import subcategoryService from '@/services/subcategoryService';
import userSubcategoryService from '@/services/userSubcategoryServices';

const UpdateTags = ({ user_id }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [refresh, setRefresh] = useState(0);

  // get skills by user id
  const [userSkills, setUserSkills] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectingSkill, setSelectingSkill] = useState('');

  // get skills and user skills when refresh change
  useEffect(() => {
    setSelectingSkill('');
    getUserSkills();
  }, [refresh]);

  // get all skills when user skills change
  useEffect(() => {
    getSkills();
  }, [userSkills]);

  // get all skills of an user
  const getUserSkills = () => {
    userSubcategoryService
      .findAll(user_id)
      .then((response) => {
        setUserSkills(response.data);
        setRefresh();
      })
      .catch((e) => {
        setErrorMessage(e.message);
      });
  };

  // get all skills in database
  const getSkills = () => {
    subcategoryService
      .findAll()
      .then((response) => {
        // remove skills that user already has
        const filteredSkills = response.data.filter(
          (skill) =>
            !userSkills.some(
              (userSkill) =>
                userSkill.subcategory_name === skill.subcategory_name
            )
        );
        setSkills(filteredSkills);
      })
      .catch((e) => {
        setErrorMessage(e.message);
      });
  };

  const handleSelectingSkillChange = (e) => {
    setSelectingSkill(e.target.value);
  };

  const handleAddTag = () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (selectingSkill === '') {
      setErrorMessage('Please select a skill');
      return;
    }

    const data = {
      userId: user_id,
      subcategoryId: selectingSkill,
    };

    userSubcategoryService
      .create(data)
      .then((response) => {
        setRefresh(refresh ^ 1);
        setSuccessMessage('Tag added successfully');
      })
      .catch((e) => {
        setErrorMessage(e.message);
      });
  };

  return (
    <div className="update-part-container">
      <div className="title">Job Tags</div>

      <div className="add-a-tag">
        <select
          className="input-tag"
          value={selectingSkill}
          onChange={handleSelectingSkillChange}
        >
          <option value="" disabled>
            Select a skill
          </option>
          {skills.map((skill) => (
            <option key={skill.subcategory_name} value={skill.id}>
              {skill.subcategory_name}
            </option>
          ))}
        </select>

        <UpdateButton button_name={'Add'} onClick={handleAddTag} />
      </div>

      <div className="current-tags">
        <TagContainer
          userId={user_id}
          list_tag={userSkills}
          refreshFunction={() => {
            setRefresh(refresh ^ 1);
          }}
          errorMessage={setErrorMessage}
          successMessage={setSuccessMessage}
        />
      </div>

      <div className="error-message">{errorMessage}</div>
      <div className="success-message">{successMessage}</div>
    </div>
  );
};

export default UpdateTags;
