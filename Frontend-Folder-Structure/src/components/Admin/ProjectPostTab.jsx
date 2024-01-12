import React, { useEffect, useState } from "react";
import "./ProjectPostTab.css";
import { ProjectPostRow, UserRow } from "..";
import { useNavigate } from "react-router";
import search from '../../assets/search.png';
import cavet from '../../assets/cavet.png';
import Pagination from '@mui/material/Pagination';
import projectPostServices from "@/services/projectPostServices";

const ProjectPostTab = () => {
    const navigate = useNavigate();
    const [projposts, setProjPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshProjPosts, setRefreshProjPosts] = useState(false); // State to trigger refresh
    const [searchKey, setSearchKey] = useState(""); // State for search key

    const fetchProjPosts = async () => {
        try {
            const response = await projectPostServices.findProjPostsByPage(page, 3, searchKey.toString());
            console.log("RESPONSE: ", response.data);
            const { proj_posts, totalPages } = response.data;
            console.log("projposts: ", proj_posts);
            console.log("totalPages: ", totalPages);
            setProjPosts(proj_posts);
            setTotalPages(totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProjPosts();
    }, [page, refreshProjPosts]); // Include searchKey in the dependency array

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleSearch = (event) => {
        if (event.key === "Enter") {
            fetchProjPosts();
        }
    };

    const handleSearchChange = (event) => {
        setSearchKey(event.target.value);
    };
    useEffect(() => {
        if(searchKey === "") {
            fetchProjPosts();
        }
    }, [searchKey]);

    return (
        <div className='ProjectPostTab'>
            <div className='search-section'>
                <div className="search-area">
                    <input
                        type="text"
                        className="text-wrapper"
                        placeholder="Search"
                        value={searchKey}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearch}
                    />
                    <img className="search-icon-instance" onClick={ fetchProjPosts} src={search} alt="Search" />
                </div>
                <div className="gr-dropdown">
                    <div className="filter-text">Reported times</div>
                    <img className="caret-icon" src={cavet} alt="Caret" />
                </div>
            </div>

            <div className="overlap-5">
                {/* <div className="table-head row">
                    <div className="col-1"></div>
                    <div className="text-wrapper-27 col-3">User name</div>
                    <div className="text-wrapper-27 col">Name</div>
                    <div className="text-wrapper-27 col">Reported times</div>
                    <div className="text-wrapper-27 col">Registration Date</div>
                    <div className="col"></div>
                </div> */}
                <div className="table-projpost">
                    {projposts.map(project => (
                        <ProjectPostRow 
                        key={project.id}
                        projectId={project.id}
                        projectTitle={project.title}
                        projectTagsId={project.tag_id}
                        projectDetail={project.detail}
                        projectBudget={[project.budget_min, project.budget_max]}
                        userID={project.user_id}
                        setRefreshProjPosts={setRefreshProjPosts}
                        handleBidClick={() => {
                        console.log('navigate to project detail page');

                        navigate(`/project/${project.id}`);
                        }} />
                    ))}
                </div>

            </div>
            <div className="pagination-section">
                <Pagination count={totalPages} variant="outlined"
                    color="primary" size="large"
                    page={page} onChange={handleChange} />
            </div>
        </div>
    );
};

export default ProjectPostTab;