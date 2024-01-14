import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./userRow.css";
import recycleBin from "../../assets/recycleBin.png";
import banUser from "../../assets/banUser.png";
import banUserActive from "../../assets/banUser_active.png";
import eyeLight from "../../assets/eyeLight.png";
import avatar_green from "../../assets/avatar_green.png";
import userDataService from "../../services/userDataServices";
import projectPostServices from "@/services/projectPostServices";
import freelancerPostService from "@/services/freelancerPostServices";
import commentService from "@/services/commentServices";

const UserRow = ({ user, refreshUsers, setRefreshUsers }) => {
    
    const { avt_url, profile_name, account_name, createdAt, reported_times, id, status } = user;
    const date = new Date(createdAt);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    const avatarSrc = avt_url === "https://imgur.com/gallery/ApNKGxs" ? avatar_green : avt_url;

    const handleRemoveUser = () => {
        console.log("Remove user: ", account_name);
        userDataService.removeUserByAccName(account_name, localStorage.getItem("AUTH_TOKEN"))
            .then((response) => {
                setRefreshUsers((prev) => !prev);
                
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const navigate = useNavigate();

    const handleViewProfile = () => {
        navigate(`/profile/${id}`);
    };
    
    const [active, setActive] = useState(status); // State to trigger refresh
    const handleChangeStatus = () => {
        const newStatus = active === 0 ? 1 : 0; // Change the logic based on your requirements
        userDataService.changeStatusByID(id, newStatus, localStorage.getItem("AUTH_TOKEN"))
            .then((response) => {
                console.log("Status changed: ", newStatus);
                setActive(newStatus);
                setRefreshUsers((prev) => !prev);
                //Change status of project post of user id
                projectPostServices.findAndChangeStatusByUserID(id, newStatus)
                .then((response) => {
                    console.log("Status changed project post: ", newStatus);
                })
                .catch((error) => {
                    console.error(error);
                });
                //Change status of freelancer post of user id
                freelancerPostService.findAndChangeStatusByUserID(id, newStatus)
                .then((response) => {
                    console.log("Status changed freelancer post: ", newStatus);
                })
                .catch((error) => {
                    console.error(error);
                });
                commentService.findAndChangeStatusByUserID(id, newStatus)
                .then((response) => {
                    console.log("Status changed comment: ", newStatus);
                })
                .catch((error) => {
                    console.error(error);
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // useEffect(() => {
    //     status=active;
    // }, [active]);

    return (
        <div className="group-wrapper">
            <div className="rows row">
                <div className="ava col-1">
                    <img className="ellipse" alt="avatar" src={avatarSrc} />
                </div>
                <div className="text-wrapper-7 col-3 name">{account_name}</div>
                <div className="text-wrapper-7 col-3 profilename">{profile_name}</div>
                <div className="text-wrapper-7 col-1">{reported_times}</div>
                <div className="text-wrapper-7 col">{formattedDate}</div>
                <div className="col">
                    <img className="ban-icon" src={active === 0 ? banUserActive : banUser} onClick={handleChangeStatus} />
                    <img className="recycle-bin" alt="Recycle bin" src={recycleBin} onClick={handleRemoveUser} />
                    <img className="eye-light" src={eyeLight} onClick={handleViewProfile} />
                </div>
            </div>
        </div>
    );
};

export default UserRow;