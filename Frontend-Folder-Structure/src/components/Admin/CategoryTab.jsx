import React, { useEffect, useState } from 'react';
import './CategoryTab.css';
import { AddCategory, CategoryBlock } from '..';
import categoryService from '@/services/categoryService';
import search from '../../assets/search.png';
import { data } from 'jquery';

const CategoryTab = () => {
  const [categories, setCategories] = useState([]);
  const [searchKey, setSearchKey] = useState(''); // State for search key
  const [showAddCategory, setShowAddCategory] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.findAllwithSubcate(
        searchKey.toString(), localStorage.getItem('AUTH_TOKEN')
      );
      setCategories(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearchKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchCategories();
    }
  };

  const handleSearchChange = (event) => {
    setSearchKey(event.target.value);
    console.log(searchKey);
  };
  useEffect(() => {
    if (searchKey === '') {
      fetchCategories();
    }
  }, [searchKey]);

  const handleAddCategoryClick = () => {
    setShowAddCategory(true);
  };

  return (
    <div className="CategoryTab">
      {showAddCategory && <AddCategory m_state={showAddCategory}
      m_function={setShowAddCategory} fetchFunction={fetchCategories}/>}
      {/* Add search box and Add category button */}
      <div className="search-section">
        {/* Search box */}
        <div className="search-area">
          <input
            className="text-wrapper"
            type="text"
            placeholder="Search Categories"
            value={searchKey}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyPress}
          />
          <img
            className="search-icon-instance"
            src={search}
            onClick={fetchCategories}
          />
        </div>
        {/* Add category button */}
        <button 
          className="add-category-button"
          onClick={handleAddCategoryClick}
          >
            New category
        </button>
      </div>

      {/* Add category gallery here */}
      <div className="category-gallery">
        {categories.map((category) => (
          // console.log(category),
          <CategoryBlock key={category.id} category={category} m_function={fetchCategories}/>
        ))}
      </div>
    </div>
  );
};
       

export default CategoryTab;
