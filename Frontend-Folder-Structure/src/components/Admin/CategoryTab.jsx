import React, { useEffect, useState } from "react";
import "./CategoryTab.css";
import { CategoryBlock } from "..";
import categoryDataService from '@/services/categoryDataServices';
import search from '../../assets/search.png';
import cavet from '../../assets/cavet.png';

const CategoryTab = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // const response = await categoryDataService.findAll();
                // setCategories(response.data);
                // console.log(response.data);
            } catch (error) {
                // console.error(error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className='CategoryTab'>
            <div className='search-section'>
                <div className="search-area">
                    <div className="text-wrapper">Search</div>
                    <img className="search-icon-instance" src={search} />
                </div>                    
                {/* Add button here */}
            </div>
            
            <div className="overlap-5">
                {/* Add category blocks in grid */}
            </div>
        </div>
    );
};

export default UserTab;