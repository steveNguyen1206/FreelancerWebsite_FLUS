import React from 'react';
import './style.css';
import { useProjectManageContext } from './ProjectManageProvider';
import { TextField } from '@mui/material';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRef } from 'react';
import projectService from '@/services/projectServices';
import { useState, useEffect } from 'react';
import { formattedDateString } from '@/helper/helper';


export const ProjectNotification = () => {

  const {setProjectTab, setReportId, notis} = useProjectManageContext();
  const [error, setError] = useState(null)


  const handleViewReport = (id) => {
    setReportId(id);
    console.log("noti set id", id);
    setProjectTab('report');
  }


  return (
    <div className="project-content-container">

        {
            notis.map(noti => (
                <div className="project-requirement-container" style={{textAlign: "left"}}>
                    <h4 className='title-text --size-16'>{noti.title}</h4>
                    <div className="row-container" style={{marginBottom: "16px"}}>
                            <h4 className="title-text --size-16" style={{marginRight: '10px'}}>{`${noti.user.account_name}`}</h4> 
                        <h4 className="title-text --size-16 --color-light">{formattedDateString(noti.createdAt)}</h4>
                    </div>
                    
                    <p sx={{width: "100%"}} >{noti.content}</p>
                    <div className="detail-container" style={{marginTop: "16px",textAlign: "right"}}>
                        { noti.report_id && (<h4 className='title-text --size-16 --color-green' onClick={() => handleViewReport(noti.report_id)}>View report</h4>)}
                    </div>
                </div>
            ))
        }

    </div>
  );
};
