import './Filter.css';
import React, { useState, useEffect } from 'react';
import subcategoryService from '@/services/subcategoryService';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import exitButton from '../../assets/exitButton.png';
import { useLocation } from 'react-router';
import { event } from 'jquery';

function valuetext(value) {
  return `${value} $`;
}

const Filter = ({
  selectedTags,
  onSelectedTagsChange,
  onSelectedRangeChange,
  onCategoryChange,
}) => {
  const initialSkills = [
    {
      id: '',
      subcategory_name: '',
    },
  ];

  const [skills, setSkills] = useState(initialSkills);
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

  useEffect(() => {
    getSkills();
  }, []);

  const getIdbyName = (name) => {
    for (let i = 0; i < skills.length; i++) {
      if (skills[i].subcategory_name == name) {
        console.log('a', skills[i].id);
        return skills[i].id;
      }
    }
  };

  const [value, setValue] = useState([0, 10000]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCategory, setSeletedCategory] = useState();
  const location = useLocation();
  // Read the category from the query parameter
  const params = new URLSearchParams(location.search);
  const category = params.get('category');
  useEffect(() => {
    if (category) {
      setSeletedCategory([category]);
      onCategoryChange(category);
    }
  }, [location.search]);

  const defaultRange = [0, 10000];

  const handleInputLowerChange = (event) => {
    const inputValue = event.target.value;
    if (
      isNaN(inputValue) ||
      inputValue < defaultRange[0] ||
      inputValue > defaultRange[1] ||
      inputValue > value[1]
    ) {
      handleChange(event, [defaultRange[0], defaultRange[1]]);
      return;
    }
    const newValue = [
      event.target.value === '' ? 0 : Number(event.target.value),
      value[1],
    ];
    setValue(newValue);
    handleChange(event, newValue);
  };

  const handleInputUpperChange = (event) => {
    const inputValue = event.target.value;
    if (
      isNaN(inputValue) ||
      inputValue < defaultRange[0] ||
      inputValue > defaultRange[1] ||
      inputValue < value[0]
    ) {
      handleChange(event, [defaultRange[0], defaultRange[1]]);
      return;
    }
    const newValue = [
      value[0],
      event.target.value === '' ? 0 : Number(event.target.value),
    ];
    setValue(newValue);

    if (newValue[0] > newValue[1]) {
      setValue([newValue[1], newValue[0]]);
    }

    handleChange(event, newValue);
  };

  const handleChange = (event, [lower, upper]) => {
    setValue([lower, upper]);
    onSelectedRangeChange([lower, upper]);
  };

  const handleFilterChange = (event) => {
    const selectedOption = event.target.value;
    if (selectedOption) {
      const selectedOptionId = getIdbyName(selectedOption);
      setSelectedSkills((prevSkills) => {
        if (!prevSkills.includes(selectedOption)) {
          return [...prevSkills, selectedOption];
        }
        return prevSkills;
      });
      if (!selectedTags.includes(selectedOptionId)) {
        onSelectedTagsChange([...selectedTags, selectedOptionId]);
      }
    }
  };
  const removeCategory = () => {
    setSeletedCategory(null);
    onCategoryChange(null);
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
      <select
        className="filter"
        onChange={handleFilterChange}
        defaultValue="Add skills"
      >
        <option value="Add skills" disabled>
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

          {selectedCategory && (
            <div className="skill" key={'cate'}>
              <p className="skill-name">{selectedCategory}</p>
              <img
                src={exitButton}
                alt="exit"
                className="exit-button-range"
                onClick={removeCategory}
              />
            </div>
          )}
        </div>
      </div>

      <div className="salary-range">
        <label htmlFor="inputRange" className="form-label">
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
              readOnly={true}
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
              readOnly={true}
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
