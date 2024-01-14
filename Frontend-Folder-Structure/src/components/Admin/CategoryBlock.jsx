import React, { useEffect, useState } from 'react';
import "./CategoryBlock.css";
import { EditCategory, AddSubcategory, EditSubcategory } from '..';
import editIcon from '../../assets/editProfileIcon.png';

const CategoryBlock = ({category, m_function}) => {
    // {
    //         "id": 1,
    //         "name": "Cate 1",
    //         "createdAt": "2023-12-16T04:50:57.000Z",
    //         "updatedAt": "2023-12-16T04:50:57.000Z",
    //         "subcategories": [
    //             {
    //                 "id": 3,
    //                 "subcategory_name": "subcat 3"
    //             },
    //             {
    //                 "id": 2,
    //                 "subcategory_name": "subcat 2"
    //             },
    //             {
    //                 "id": 1,
    //                 "subcategory_name": "subcat 1"
    //             }
    //         ]
    //     },
    const name = category.name;
    const num_subcat = category.subcategories.length;
    const list_subcat = category.subcategories;
    const [showEditCategory, setShowEditCategory] = useState(false);
    const [showAddSubcategory, setShowAddSubcategory] = useState(false);
    const [showEditSubcategory, setShowEditSubcategory] = useState(false);
    const [subcatToEdit, setSubcatToEdit] = useState({});

    const handleEditCategory = () => {
        setShowEditCategory(true);
    }

    const handleAddSubcategory = () => {
        setShowAddSubcategory(true);
    }

    const handleEditSubcategory = (subcat) => {
        console.log("Subcat to Edit: ");
        console.log(subcat);
        setSubcatToEdit(subcat)
        setShowEditSubcategory(true);
    }

    return(
        <div className="align-elements category-wrapper">
            {/* edit category */}
            {showEditCategory && <EditCategory m_state={showEditCategory}
            m_function={setShowEditCategory} fetchFunction={m_function} category={{id: category.id, name: category.name}}/>}

            {/* add subcategory */}
            {showAddSubcategory && <AddSubcategory m_state={showAddSubcategory}
            m_function={setShowAddSubcategory} fetchFunction={m_function} categoryId={category.id}/>}

            {/* edit subcategory */}
            {showEditSubcategory && <EditSubcategory m_state={showEditSubcategory}
            m_function={setShowEditSubcategory} fetchFunction={m_function} subcategory={subcatToEdit}/>}

            {/* Add name and pencil here */}
            <div className="name-wrapper">
                <div className="name" onClick={handleEditCategory}>{name}</div>
                <img className="pencil-icon" src={editIcon} onClick={handleAddSubcategory}/>
            </div>

            {/* Add total subcat on the right */}
            <div className="subcat-num-wrapper">
                <div className="subcat-num">Total: {num_subcat}</div>
            </div>

            {/* Add list subcat */}
            <div className="subcat-list">
                {list_subcat.map((subcat) => (
                        // console.log("SUBCAT: " + subcat);
                        // {/* edit - delete subcategory */}
                    <div className="subcat-wrapper">
                        <div className="subcat-name" onClick={() => handleEditSubcategory(subcat)}>{subcat.subcategory_name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryBlock;