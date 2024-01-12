import React, { useEffect, useState } from "react";
import "./ComplainTab.css";
import { UserRow } from "..";
import userDataService from '@/services/userDataServices';
import search from '../../assets/search.png';
import cavet from '../../assets/cavet.png';
import Pagination from '@mui/material/Pagination';
import issueServices from "@/services/issueServices";
import IssueRow from "./IssueRow";

const ComplainTab = () => {
    const [issues, setIssues] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshIssues, setRefreshIssues] = useState(false); // State to trigger refresh
    const [searchKey, setSearchKey] = useState(""); // State for search key

    const fetchIssues = async () => {
        try {
            const response = await issueServices.findIssuesByPage(page, 6, searchKey.toString());
            console.log("RESPONSE: ", response.data);
            const { issues, totalPages } = response.data;
            console.log("issues: ", issues);
            console.log("totalPages: ", totalPages);
            setIssues(issues);
            setTotalPages(totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, [page, refreshIssues]); // Include searchKey in the dependency array

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleSearch = (event) => {
        if (event.key === "Enter") {
            fetchIssues();
        }
    };

    const handleSearchChange = (event) => {
        setSearchKey(event.target.value);
    };
    useEffect(() => {
        if(searchKey === "") {
            fetchIssues();
        }
    }, [searchKey]);

    return (
        <div className='ComplainTab'>
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
                    <img className="search-icon-instance" onClick={ fetchIssues} src={search} alt="Search" />
                </div>
            </div>

            <div className="overlap-5">
                <div className="table-user">
                    {issues.map(issue => (
                        <IssueRow key={issue.id} issue={issue} />
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

export default ComplainTab;