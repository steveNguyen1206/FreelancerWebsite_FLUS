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
import paymentServices from '@/services/paymentServices';
import { getCurrentDateTime } from '@/helper/helper';


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
    
    const handleResolveIssue = async (isAccept) => {
        const payload = {
            batch_id: getCurrentDateTime(),
            subject: isAccept ? `Issuse ${issue.id} of project ${issue.project_id} accepted.` : `Issue ${issue.id} of project ${issue.project_id} rejected.`,
            message: isAccept ? `Refound for project ${issue.project_id}. Thank you for your contribution` : `Your issue ${issue.id} of project ${issue.project_id} is rejected. Please contact us for more information.`,
            projectId: issue.project_id,
            accept: isAccept,
            userId: issue.userId,
            amount: issue.amount,
            currency: "USD",
            sender_item_ids: [issue.id  + getCurrentDateTime()],
        }
        try {
            const response = await paymentServices.resolveComplaint(issue.id, payload, localStorage.getItem('AUTH_TOKEN'));
            console.log("RESPONSE: ", response.data);
            setRefreshIssues(!refreshIssues);
        } catch (error) {
            console.error(error);
        }   
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

            {issue.status == 0 && (
                <div className="right-post">
                <div className="pbid">
                    <div class="bid-button">
                        <button className="reject" onClick={() => handleResolveIssue(false)}>
                            Reject
                        </button>
                        <button className="accept" onClick={() => handleResolveIssue(true)}>
                            Accept
                        </button>
                    </div>
                </div>
            </div>
            )}

            {issue.status == 1 && (
                <div className="right-post">
                    Accepted
                </div>    
            )}
        </div>
    );
}

export default IssueRow;
