import React, { useEffect, useState } from "react";
import "./UserTab.css";
import { UserRow } from "..";
import userDataService from '@/services/userDataServices';
import search from '../../assets/search.png';
import cavet from '../../assets/cavet.png';
import Pagination from '@mui/material/Pagination';

const UserTab = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshUsers, setRefreshUsers] = useState(false); // State to trigger refresh
    const [searchKey, setSearchKey] = useState(""); // State for search key
    const [noMatching, setNoMatching] = useState(false); // State for search key

    const fetchUsers = async () => {
        try {
            const response = await userDataService.findUsersbyPage(page, 6, searchKey.toString());
            console.log("RESPONSE: ", response.data);
            const { users, totalPages } = response.data;
            console.log("users: ", users);
            console.log("totalPages: ", totalPages);
            setUsers(users);
            setTotalPages(totalPages);
            if(users.length == 0) {
                setNoMatching(true);
            }else{
                setNoMatching(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, refreshUsers]); // Include searchKey in the dependency array

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleSearch = (event) => {
        if (event.key === "Enter") {
            fetchUsers();
        }
    };

    const handleSearchChange = (event) => {
        setSearchKey(event.target.value);
    };
    useEffect(() => {
        if(searchKey === "") {
            fetchUsers();
        }
    }, [searchKey]);

    return (
        <div className='UserTab'>
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
                    <img className="search-icon-instance" onClick={ fetchUsers} src={search} alt="Search" />
                </div>
                <div className="gr-dropdown">
                    <div className="filter-text">Reported times</div>
                    <img className="caret-icon" src={cavet} alt="Caret" />
                </div>
            </div>

            <div className="overlap-5">
                <div className="table-head row">
                    <div className="col-1"></div>
                    <div className="text-wrapper-27 col-3">User name</div>
                    <div className="text-wrapper-27 col">Name</div>
                    <div className="text-wrapper-27 col">Reported times</div>
                    <div className="text-wrapper-27 col">Registration Date</div>
                    <div className="col"></div>
                </div>
                {noMatching && (<div style={{color:"red", textAlign:"center", width:"100%"}}>No matching results</div>)}
                <div className="table-user">
                    {users.map(user => (
                        <UserRow key={user.id} user={user} refreshUsers={refreshUsers}
                            setRefreshUsers={setRefreshUsers} />
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

export default UserTab;