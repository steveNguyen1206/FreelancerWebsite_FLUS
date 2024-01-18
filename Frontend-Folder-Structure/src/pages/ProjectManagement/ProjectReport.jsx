import React from 'react';
import './style.css';
import { useProjectManageContext } from './ProjectManageProvider';
import { TextField } from '@mui/material';
import { useState } from 'react';
import projectService from '@/services/projectServices';
import { useEffect } from 'react';

export const ProjectReport = () => {
  const initialPayload = {
    resources: '',
    message: '',
    projectId: '',
  };
  const { project, reportId, error, setError } = useProjectManageContext();
  const [report, setReport] = useState(initialPayload);
  const [sended, setSended] = useState(false);
  console.log(project);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReport({
      ...report,
      [name]: value,
    });
    console.log(report);
  };

  const ValidateIssue = () => {
    if (report.content == '' || report.resources == '') {
      return false;
    }
    return true;
  };

  const handleCreateReport = async () => {
    if(ValidateIssue())
    {
      const responce = await projectService.createProjectReport(
        project.id,
        localStorage.getItem('AUTH_TOKEN'),
        report
      );
      console.log(responce);
      setSended(true);
      setError(null);
    }
    else
    {
      setError("Please fill in the message and resources");
    }
  };

  useEffect(() => {
    console.log("report id", reportId)
    if(reportId)
    {
      projectService
        .getProjectReport(project.id, reportId, localStorage.getItem('AUTH_TOKEN'))
        .then((report_data) => {
          if (report_data.status == 200) {
            setReport(report_data.data);
          }
          console.log(report);
        });
    }
    setError(null);
  
  }, [project, reportId]);

  return (
    <div className="project-content-container">
      {sended ? (
        <div
          className="project-requirement-container"
          style={{ padding: '5%', textAlign: 'center' }}
        >
          <div className="title-text --size-20">Report Sended!</div>
        </div>
      ) : (
        <>
          <div
            className="project-content-title"
            style={{ textAlign: 'center' }}
          >
            <h4 className="title-text">Report</h4>
          </div>

          <div
            className="project-requirement-container"
            style={{ padding: '5%' }}
          >
            <div className="title-text --size-16">Message</div>
            <TextField
              multiline
              name="message"
              placeholder="Telling your client what you have done for the project."
              minRows={5}
              onChange={handleInputChange}
              value={report.message}
            />

            <div className="title-text --size-16" style={{ marginTop: 16 }}>
              Resources
            </div>
            <TextField
              multiline
              name="resources"
              placeholder="Place resources that contain your work heres. Please paste your link to resources here."
              sx={{ backgroundColor: '#EBE8E8' }}
              minRows={5}
              onChange={handleInputChange}
              value={report.resources}
            />
            <div style={{ height: '30px', width: '100%' }}> 
              <div className="value-text --size-14 --color-error">{error}</div>
            </div>
            <div className="project-content-container --center">
              <button
                className="my-button --button-green"
                onClick={handleCreateReport}
                disabled={project.status == 3 || project.status == 4}
              >
                Complete and send for judgment
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
