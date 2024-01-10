import React from 'react';
import './style.css';
import { useProjectManageContext } from './ProjectManageProvider';
import { TextField } from '@mui/material';
import { useState } from 'react';
import projectIssuesServices from '@/services/projectIssuesServices';
import { useEffect } from 'react';

export const ProjectComplaint = () => {
  const { project, isOwn, error, setError} = useProjectManageContext();
  const initialPayload = {
    resources: '',
    content: '',
    projectId: project.id,
    type: isOwn ? 1 : 2,
    status: 0,
  };
  const [issue, setIssue] = useState(initialPayload);
  const [sended, setSended] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setIssue({
      ...issue,
      [name]: value,
    });
    console.log(issue);
  };

  // check message and recources before call issuse api, if message and resources is empty, render error message
  const ValidateIssue = () => {
    if (issue.content == '' || issue.resources == '') {
      return false;
    }
    return true;
  };

  const handleCreateIssue = async () => {
    if(ValidateIssue())
    {
      const responce = await projectIssuesServices.createProjectIssues(
        project.id,
        localStorage.getItem('AUTH_TOKEN'),
        issue
      );
      console.log(responce);
      setSended(true);
    }
    else {
      setError("Please fill in the message and resources");
      console.log(error);
    }
  };

  useEffect(() => {
    // if(reportId)
    // {
    //   projectService
    //     .getProjectReport(project.id, reportId, localStorage.getItem('AUTH_TOKEN'))
    //     .then((report_data) => {
    //       if (report_data.status == 200) {
    //         setReport(report_data.data);
    //       }
    //       console.log(report);
    //     });
    // }
    setError(null);
  }, []);

  return (
    <div className="project-content-container">
      {sended ? (
        <div
          className="project-requirement-container"
          style={{ padding: '5%', textAlign: 'center' }}
        >
          <div className="title-text --size-20">Complaint Sended!</div>
        </div>
      ) : (
        <>
          <div
            className="project-content-title"
            style={{ textAlign: 'center' }}
          >
            <h4 className="title-text">Complaint</h4>
          </div>

          <div
            className="project-requirement-container"
            style={{ padding: '5%' }}
          >
            <div className="title-text --size-16">Message</div>
            <TextField
              multiline
              name="content"
              placeholder="Write down your complaint about this project as well as your parner. We will try our best to help you."
              minRows={5}
              onChange={handleInputChange}
            />

            <div className="title-text --size-16" style={{ marginTop: 16 }}>
              Resources
            </div>
            <TextField
              multiline
              name="resources"
              placeholder="Place resources that make envidence for your complaint so that we can help you as much as we could."
              sx={{ backgroundColor: '#EBE8E8' }}
              minRows={5}
              onChange={handleInputChange}
            />

            <div style={{ height: '30px', width: '100%' }}> 
              <div className="value-text --size-14 --color-error">{error}</div>
            </div>
            <div className="project-content-container --center">
              <button
                className="my-button --button-green"
                onClick={handleCreateIssue}
              >
                Send Complaint
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
