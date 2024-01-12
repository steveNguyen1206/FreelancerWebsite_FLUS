import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./IssueRow.css";
// import recycleBin from "../../assets/recycleBin.png";
// import banIssue from "../../assets/banIssue.png";
// import banIssueActive from "../../assets/banIssue_active.png";
import eyeLight from "../../assets/eyeLight.png";
import avatar_green from "../../assets/avatar_green.png";
import userDataService from "@/services/userDataServices";

const IssueRow = ({ issue, refreshIssues, setRefreshIssues }) => {

    const [ownerProject, setOwnerProject] = useState([]);
  
    // get User info from id
    const fetchOwnerProject = async () => {
      try {
        const ownerProjectData = await userDataService.findOnebyId(issue.userId);
        setOwnerProject(ownerProjectData.data);
        console.log("user data: ",ownerProjectData.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    useEffect(() => {
        fetchOwnerProject();
    }, []);

    const avatar = (ownerProject.avt_url == "https://imgur.com/gallery/ApNKGxs") ? avatar_green : ownerProject.avt_url;
    
    const handleAccept = async () => {
    };
    const handleReject = async () => {
    };

    return (
        <div className="issue-container">
            <div className="left-post">
                <div className="pheader">
                    <div className="pprofile">
                        <img src={avatar} alt="profile" />
                        <div className="pname">{ownerProject.profile_name} </div>
                        <div className="pusername">({ownerProject.account_name})</div>
                    </div>
                </div>
                <div className='content-container'>
                    <div className="ptitle">Project Id: {issue.project_id}</div>
                    <div className="details">
                        <div className="detail-content">
                            {issue.content}
                        </div>
                    </div>
                    <div className="ptitle">Evidence: 
                        <p className="evidence">
                            {issue.resources}   
                        </p>
                    </div>
                </div>
            </div>

            <div className="right-post">
                <div className="pbid">
                    <div class="bid-button">
                        <button className="reject" onClick={handleReject}>
                            Reject
                        </button>
                        <button className="accept" onClick={handleAccept}>
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IssueRow;
