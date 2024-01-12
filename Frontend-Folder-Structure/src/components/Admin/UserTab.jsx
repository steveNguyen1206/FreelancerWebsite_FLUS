import React, { useEffect, useState } from "react";
import "./UserTab.css";
import { UserRow } from "..";
import userDataService from '@/services/userDataServices';
import search from '../../assets/search.png';
import cavet from '../../assets/cavet.png';
import Pagination from '@mui/material/Pagination';
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const UserTab = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshUsers, setRefreshUsers] = useState(false); // State to trigger refresh
    const [searchKey, setSearchKey] = useState(""); // State for search key
    const [noMatching, setNoMatching] = useState(false); // State for search key
    const [sort_type, setSort_type] = useState(""); // State for sort key
    

    const fetchUsers = async () => {
        try {
            const response = await userDataService.findUsersbyPage(page, 6, searchKey.toString());
            // console.log("RESPONSE: ", response.data);
            const { users, totalPages } = response.data;
            // console.log("users: ", users);
            // console.log("totalPages: ", totalPages);
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

    const handleSortTypeChange = (event) => {
        const selectedSortType = event.target.value;
        let sortedUsers = [...users];

        switch (selectedSortType) {
            case "Reported Times Ascending":
                sortedUsers.sort((a, b) => a.reported_times - b.reported_times);
                console.log("sortedUsers: ", sortedUsers);
                break;
            case "Reported Times Descending":
                sortedUsers.sort((a, b) => b.reported_times - a.reported_times);
                break;
            case "Banned First":
                sortedUsers.sort((a, b) => a.status - (b.status));
                break;
            case "Not Banned First":
                sortedUsers.sort((a, b) => b.status - (a.status));
                break;
            default:
                break;
        }

        setSort_type(selectedSortType);
        setUsers(sortedUsers);
    };

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
                
                <FormControl sx={{ minWidth: 200, m:1}} size="small">
                    <InputLabel id="demo-simple-select-label">Sort by:</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={sort_type}
                    label="Sort by:"
                    onChange={handleSortTypeChange}
                    >
                        <MenuItem value={"None"}>None</MenuItem>
                        <MenuItem value={"Reported Times Ascending"} >Reported Times Ascending</MenuItem>
                        <MenuItem value={"Reported Times Descending"}>Reported Times Descending</MenuItem>
                        <MenuItem value={"Not Banned First"}>Not Banned First</MenuItem>
                        <MenuItem value={"Banned First"}>Banned First</MenuItem>
                    </Select>
                </FormControl>

                
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