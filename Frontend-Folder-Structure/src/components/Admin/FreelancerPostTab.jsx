import React, { useEffect, useState } from "react";
import "./ProjectPostTab.css";
import { FreelancerPostRow} from "..";
import { useNavigate } from "react-router";
import search from '../../assets/search.png';
import cavet from '../../assets/cavet.png';
import Pagination from '@mui/material/Pagination';
import freelancer_post_Service from "@/services/freelancer_post_Service";

const FreelancerPostTab = () => {
    const navigate = useNavigate();
    const [freeposts, setFreePosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshFreePosts, setRefreshFreePosts] = useState(false); // State to trigger refresh
    const [searchKey, setSearchKey] = useState(""); // State for search key
    const [noMatching, setNoMatching] = useState(false); // State for search key

    const fetchFreePosts = async () => {
        try {
            const response = await freelancer_post_Service.findFreePostsByPage(page, 3, searchKey.toString(), localStorage.getItem("AUTH_TOKEN"));
            console.log("RESPONSE: ", response.data);
            const { free_posts, totalPages } = response.data;
            console.log("freeposts: ", free_posts);
            console.log("totalPages: ", totalPages);
            setFreePosts(free_posts);
            setTotalPages(totalPages);
            if(free_posts.length == 0) {
                setNoMatching(true);
            }else{
                setNoMatching(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFreePosts();
    }, [page, refreshFreePosts]); // Include searchKey in the dependency array

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleSearch = (event) => {
        if (event.key === "Enter") {
            fetchFreePosts();
        }
    };

    const handleSearchChange = (event) => {
        setSearchKey(event.target.value);
    };
    useEffect(() => {
        if(searchKey === "") {
            fetchFreePosts();
        }
    }, [searchKey]);

    return (
        <div className='FreelancerPostTab'>
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
                    <img className="search-icon-instance" onClick={ fetchFreePosts} src={search} alt="Search" />
                </div>
                {/* <div className="gr-dropdown">
                    <div className="filter-text">Reported times</div>
                    <img className="caret-icon" src={cavet} alt="Caret" />
                </div> */}
            </div>

            <div className="overlap-5">
                {noMatching && (<div style={{color:"red", textAlign:"center", width:"100%"}}>No matching results</div>)}
                <div className="table-projpost">
                    {freeposts.map(post => (
                        <FreelancerPostRow 
                        key={post.id}
                        freepostId={post.id}
                        freepostTitle={post.title}
                        freepostTagsId={post.skill_tag}
                        freepostDescription={post.skill_description}
                        freepostBudget={post.lowset_price}
                        freepostStatus={post.status}
                        userID={post.freelancer_id}
                        setRefreshFreePosts={setRefreshFreePosts}
                        handleViewClick={() => {
                        console.log('navigate to findFreelancer detail page');

                        navigate(`/findFreelancer/${post.id}`);
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

export default FreelancerPostTab;