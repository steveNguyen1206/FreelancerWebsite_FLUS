import './Filter.css';
import React, { useState, useEffect } from 'react';
import subcategoryService from '@/services/subcategoryService';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import exitButton from '../../assets/exitButton.png';

function valuetext(value) {
  return `${value} $`;
}

const Filter = ({ selectedTags, onSelectedTagsChange, onSelectedRangeChange }) => {
  const initialSkills = [
    {
      id: '',
      subcategory_name: '',
    },
  ];

  const [skills, setSkills] = useState(initialSkills);

  useEffect(() => {
    getSkills();
  }, []);

  const getSkills = () => {
    subcategoryService
      .findAll()
      .then((response) => {
        setSkills(response.data);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const [value, setValue] = useState([0, 10000]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleInputLowerChange = (event) => {
    setValue([
      event.target.value === '' ? 0 : Number(event.target.value),
      value[1],
    ]);
  };

  const handleInputUpperChange = (event) => {
    setValue([
      value[0],
      event.target.value === '' ? 0 : Number(event.target.value),
    ]);
  };

  const handleChange = (event, [lower, upper]) => {
    setValue([lower, upper]);
    onSelectedRangeChange([lower, upper]);
  };


  const getIdbyName = (name) => {
    for (let i = 0; i < skills.length; i++) {
      if (skills[i].subcategory_name === name) {
        console.log("a", skills[i].id)
        return skills[i].id;
      }
    }
  };

  const handleFilterChange = (event) => {
    const selectedOption = event.target.value;
    if (selectedOption) {
      const selectedOptionId = getIdbyName(selectedOption);
      setSelectedSkills((prevSkills) => [...prevSkills, selectedOption]);
      onSelectedTagsChange([...selectedTags, selectedOptionId]);
    }
  };

  const handleRemoveSkill = (index) => {
    const removedTag = selectedSkills[index];
    setSelectedSkills((prevSkills) => prevSkills.filter((_, i) => i !== index));
    const removedTagId = getIdbyName(removedTag);
    onSelectedTagsChange(
      selectedTags.filter((tagId) => tagId !== removedTagId)
    );

  };

  return (
    <div className="filter-container">
      <div className="header">
        <h2>Filter</h2>
      </div>
      <select className="filter" onChange={handleFilterChange}>
        <option value="Add skills" disabled selected>
          Add skills
        </option>
        {skills.map((skill) => (
          <option key={skill.id} value={skill.subcategory_name}>
            {skill.subcategory_name}
          </option>
        ))}
      </select>
      <div className="overlay-container">
        <div className="skill-container">
          
          {selectedSkills.map((skill, index) => (
            <div className="skill" key={index}>
              <p className="skill-name">{skill}</p>
              <img
                src={exitButton}
                alt="exit"
                className="exit-button-range"
                onClick={() => handleRemoveSkill(index)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="salary-range">
        <label for="inputRange" class="form-label">
          Salary Range
        </label>
        <Box sx={{ width: 250 }}>
          <Slider
            getAriaLabel={() => 'Money range'}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            // getAriaValueText={valuetext}
            id="inputRange"
            min={0}
            max={10000}
            sx={{
              '& .MuiSlider-thumb': {
                color: '#15A919',
              },
              '& .MuiSlider-track': {
                color: '#15A919',
              },
              '& .MuiSlider-rail': {
                color: '#9feda2',
              },
              '& .MuiSlider-active': {
                color: 'green',
              },
            }}
          />
        </Box>
        {/* <div className="display"> */}
        <div className="text-range-row">
          <p className="text-range">From</p>
          <div className="lower">
            <input
              className="values"
              value={value[0]}
              id="inputLower"
              onChange={handleInputLowerChange}
            />
          </div>
          <p className="dollar">$</p>
        </div>
        <div className="text-range-row">
          <p className="text-range">To</p>
          <div className="upper">
            <input
              className="values"
              value={value[1]}
              id="inputUpper"
              onChange={handleInputUpperChange}
            />
          </div>
          <p className="dollar">$</p>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Filter;
