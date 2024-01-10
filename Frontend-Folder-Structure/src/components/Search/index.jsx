import React from 'react';
import SearchIcon from "../../assets/search.png"
import "./Search.css"

const Search = ({onSearchChange}) => {
  return (
    <div className='search-bar' style={{ position: 'relative' }}>
      <input className='input' type="text" placeholder="Search..." onChange={onSearchChange}/>
      <img className='search-icon' src={SearchIcon} alt="Search Icon" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }} />
    </div>
  );
};

export default Search;
