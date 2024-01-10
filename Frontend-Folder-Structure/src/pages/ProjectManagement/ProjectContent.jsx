import React, { useState } from "react";
import "./style.css";
import { useProjectManageContext } from "./ProjectManageProvider";
import { ProjectStatus } from ".";

export const ProjectContent = () => {

  const {project, setProject} = useProjectManageContext();
  const [eror, setError] = useState(null);

  function calculateTimeProgress(startDateString, endDateString) {
    // Convert date strings to Date objects
    console.log(endDateString)
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    console.log(startDateString, endDateString);
  
    // Get the current date
    const currentDate = new Date();
  
    // Calculate the total time difference in milliseconds
    const totalTimeDifference = endDate - startDate;
  
    // Calculate the time difference from start day to current day in milliseconds
    const currentTimeDifference = currentDate - startDate;
    console.log(currentTimeDifference, totalTimeDifference);
  
    // Calculate the percentage of time that has passed
    const percentComplete = (currentTimeDifference / totalTimeDifference) * 120;
  
    console.log(percentComplete);
    // Return the result
    return percentComplete.toFixed(2); // Round to 2 decimal places
  }


  console.log(project)
  return (
          <div className="project-content-container">

            <div className="content-container">
            <div className="project-content-title">
              <h4 className="label-text">Project name</h4>
              <h4 className="title-text">{project.project_name}</h4>
            </div>

            <div className="row-container">
              <div className="field-container">
                <div className="label-text">Date begin</div>
                <div className="value-text">{project.start_date}</div>
              </div>

              <div className="field-container">
                <div className="label-text">Date end</div>
                <div className="value-text">{project.end_date}</div>
              </div>
            </div>

            <div className="row-container">
              <div className="field-container">
                <div className="label-text">Project owner</div>
                <div className="value-text">{project.owner.account_name}</div>
              </div>
              <div className="field-container">
              <h4 className="label-text">Project member</h4>
                <h5 className="value-text">{project.member.account_name}</h5>
              </div>
            </div>

            <div className="filed-container">
              <div className="label-text">Status</div>
              <div className="value-text">{project.status == ProjectStatus.COMPLETED ? "Finished" : ( project.status == ProjectStatus.CANCELED ? "Failed" : "In progress")}</div>
            </div>  
            </div>

            {project.status != ProjectStatus.COMPLETED && project.status != ProjectStatus.CANCELED &&
            (
            <div className="progress-container">
              <h4 className="title-text --size-20" >Progress</h4>
              <div className="progress-bar-container">
              <span className="progress-mark label-text --size-16" style={{ left: '-10%' }}>{project.start_date.slice(-5)}</span>
              <span className="progress-mark label-text --size-16" style={{ left: '100%' }}>{project.end_date.slice(-5)}</span>
                <div className="progress-bar-full"></div>
                <div className="progress-bar-now" style={{width: `${calculateTimeProgress(project.start_date, project.end_date)}%`}}></div>
              </div>

            </div>
            )}

            <div className="project-requirement-container">
              <h4 className="title-text --size-20">Requierments</h4>
              <p>{project.project_description}</p>
            </div>

            
          </div>
  );
};
