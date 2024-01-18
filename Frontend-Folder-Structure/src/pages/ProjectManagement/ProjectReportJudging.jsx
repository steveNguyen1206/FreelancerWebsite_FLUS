import React from 'react';
import './style.css';
import { useProjectManageContext } from './ProjectManageProvider';
import { TextField } from '@mui/material';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRef } from 'react';
import paymentServices from '@/services/paymentServices';
import projectService from '@/services/projectServices';
import { useState, useEffect } from 'react';
import { formattedDateString } from '@/helper/helper';
import { getCurrentDateTime } from '@/helper/helper';
import { get } from 'jquery';

const PROJECT_ACCEPTED = 3;
const PROJECT_REJECTED = 4;
const PROJECT_EXTEND_TIME = 2;
const REPORT_REMAIN = 0;
const REPORT_ACCEPTED = 1;
const REPORT_REJECTED = 2;

export const ProjectReportJudging = () => {
  const { project, setProject, reportId, setReportId } =
    useProjectManageContext();
  const [updated, setUpdated] = useState(false);

  const reference = useRef();
  reference.project = project;
  reference.reportId = reportId;
  console.log(reportId)
  const [report, setReport] = useState({});
  const [error, setError] = useState(null);
  useEffect(() => {
    setUpdated(false);
    // console.log(project)

    if(reportId)
    {
      projectService
        .getProjectReport(project.id, reportId, localStorage.getItem('AUTH_TOKEN'))
        .then((report_data) => {
          console.log(report_data);
          if (report_data.status == 200) {
            setReport(report_data.data);
          }
        })
        .catch((error) => {
          console.log(error);
          setError(error.response.data.message);
          console.log(error.response.data.message);
        });
    }
    else
    {

    projectService
      .getNewestProjectReport(project.id, localStorage.getItem('AUTH_TOKEN'))
      .then((report_data) => {
        setReportId(report_data.data.id);
        if (report_data.status == 200) {
          setReport(report_data.data);
        }
        console.log(report_data);
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.message);
        console.log(error.response.data.message);
      });
    }

  }, [project, reportId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProject({ ...project, [name]: value });
    // setPrePaidPayload({...prepaidPayload, "product_cost": prePaidFull ? project.budget : project.budget * 30 / 100});
  };

  const createOrder = async (data) => {
    const payload = {
      product_cost: (reference.project.budget * 70) / 100,
      currenry_code: 'USD',
      item_name: 'Project Budget completetion fee',
      description: 'Full paid for project budget ' + reference.project.id,
      sku: project.id,
      email: reference.project.owner.email,
      first_name: reference.project.profile_name,
      last_name: reference.project.profile_name,
      phone: '84' + reference.project.owner.phone_number,
    };

    try {
      console.log('create order:', payload);
      const response = await paymentServices.createOrder(payload);
      console.log(response.data); // Log the response data
      const order = response.data;
      return order.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const onApprove = async (data) => {
    console.log(data);
    try {
      const payload = {
        ...data,
        ...reference.project,
        status: 2,
        tran_amount: (reference.project.budget * 70) / 100,
        userId: reference.project.owner_id,
        tran_type: '0',
        noti_title: 'Project budget fully covered!',
        noti_content:
          'The client has fully paid the project budget. Time to judging project report. Freelancer will get all the remuneration after your report be accepted.',
      };
      const response = await paymentServices.paidAndUpdateProject(
        reference.project.id,
        payload,
        localStorage.getItem('AUTH_TOKEN')
      );
      console.log('Payment successful', response.data); // Log the response data

      window.location.reload();
      return response.data;
    } catch (error) {
      // setPaySuccess(false);
      console.error('Error capturing PayPal order:', error);
      throw error;
    }
  };

  const updateReport = (report_status, project_status) => {
    let noti_title = '';
    let noti_message = '';


    noti_title =
      'The report is particial passed and project is giving some extra time.';
    noti_message =
      'The project owner extend the deadline of this project. Freelancer have to make a new report before end date of project. Good luck!';
  

    const payload = {
      ...reference.project,
      report_status: report_status,
      status: project_status,
      noti_title: noti_title,
      noti_content: noti_message,
      report_id: reference.reportId,
    };

    console.log("tét 1", reference.reportId)
    projectService
      .updateReport(project.id, payload, localStorage.getItem('AUTH_TOKEN'))
      .then((response) => {
        console.log(response);
        setUpdated(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.message);
      });
  };

  const acceptProject = async () => {

    let noti_title = 'The report is accepted.';
    let noti_message = 'Report have been accepted. Project is finished! Congratulation!';

    const payoutPayload = {
      batch_id: getCurrentDateTime(),
      subject: `Honorarium for your work on project ${reference.project.project_name}`,
      message: "You do a great job. Thank you for your contribution!",
      costs: [ // array of costs
        reference.project.budget 
      ],
      // cost: reference.project.budget,
      currency: "USD",
      sender_item_ids: [reference.project.id + reference.project.member_id + getCurrentDateTime()],
      // receiver: "sb-3di0w28451063@personal.example.com",
      receiverIds: [  // array of receivers id
        reference.project.member_id
      ],
      // receiverId: reference.project.member_id,
      noti_title: noti_title,
      noti_content: noti_message,
      report_id: reference.reportId,
    }
    try {
      const response = await paymentServices.acceptProject(reference.project.id, payoutPayload, localStorage.getItem('AUTH_TOKEN'));
      setUpdated(true);
      console.log(response)
    }
    catch (error){
      setUpdated(false);
      console.error("Error accept project", error);
      throw error;
    }
  }

  // create reject project function
  const rejectProject = async () => {
    let noti_title = 'The report is rejected.';
    let noti_message = 'We are so sorry to say that the project owner has rejected this work. After five days, if there is no complaint, we fill refound 70% of budget to project owner, and 30% to freelancer. Please contact to us for refound issues in within five days.';

    const payoutPayload = {
      batch_id: getCurrentDateTime(),
      subject: `Honorarium for your work on project ${reference.project.project_name}`,
      message: "You do a great job. Thank you for your contribution!",
      // costs: 70% budget for owner, 30% budget for freelancer
      costs: [
        (reference.project.budget * 70) / 100,
        (reference.project.budget * 30) / 100
      ],
      currency: "USD",
      // create sender_item_id that is a list of concat of project id and owner id, member id
      sender_item_ids: [
        reference.project.id + reference.project.owner_id + getCurrentDateTime(),
        reference.project.id + reference.project.member_id + getCurrentDateTime()
      ],
      // sender_item_id: reference.project.id,
      // receiverIds: owner and freelancer id
      receiverIds: [
        reference.project.owner_id,
        reference.project.member_id
      ],
      noti_title: noti_title,
      noti_content: noti_message,
      report_id: reference.reportId,
    }
    try {
      const response = await paymentServices.rejectProject(reference.project.id, payoutPayload, localStorage.getItem('AUTH_TOKEN'));
      setUpdated(true);
      console.log(response)
    }
    catch (error){
      setUpdated(false);
      console.error("Error reject project", error);
      throw error;
    }
  };

  return (
    <>
      {project.status == 1 && (
        <div className="project-content-container">
          <div
            className="project-content-title"
            style={{ textAlign: 'center' }}
          >
            <h4 className="title-text">Judging Report</h4>
          </div>

          <h4 className="title-text --size-20" style={{ marginBottom: '16px' }}>
            You have to complete the project budget responsibility before view
            the report
          </h4>

          <div className="row-container" style={{ alignItems: 'left' }}>
            <div className="field-container">
              <h4 className="title-text --size-16">Pre paid</h4>
              <div className="row-container" style={{ marginBottom: 0 }}>
                <input
                  name="budget"
                  type="text"
                  className="label-text --size-20 my-input"
                  value={(project.budget * 30) / 100}
                  readOnly
                />
                <h4 className="title-text --size-16">VND</h4>
              </div>
            </div>
          </div>

          <div className="row-container" style={{ alignItems: 'left' }}>
            <div className="field-container">
              <h4 className="title-text --size-16">Remaining</h4>
              <div className="row-container" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  className="label-text --size-20 my-input"
                  value={(project.budget * 70) / 100}
                  readOnly
                />
                <h4 className="title-text --size-16">VND</h4>
              </div>
            </div>
          </div>

          <div style={{ width: '80%' }}>
            <PayPalButtons
              createOrder={(data, actions) => createOrder(data, actions)}
              onApprove={(data, actions) => onApprove(data, actions)}
            />
          </div>
        </div>
      )}

      {(project.status == 2 || project.status == 3 || project.status == 4 || project.status == 5) &&
        (error ? (
          <>{error}</>
        ) : (
          <div className="project-content-container">
            {updated ? (
              <div
                className="project-requirement-container"
                style={{ padding: '5%' }}
              >
                <h5 className="title-text --size-20">Update successfully</h5>
              </div>
            ) : (
              <>
                <div
                  className="project-content-title"
                  style={{ textAlign: 'center' }}
                >
                  <h4 className="title-text">Judging Report</h4>
                </div>

                <div
                  className="project-requirement-container"
                  style={{ padding: '5%' }}
                >
                  <div
                    className="row-container"
                    style={{ marginBottom: '16px' }}
                  >
                    <h5
                      className="title-text --size-16"
                      style={{ marginRight: '5px' }}
                    >
                      Last edit:{' '}
                    </h5>
                    <h5 className="title-text --color-light --size-16">
                      {formattedDateString(report.updatedAt)}
                    </h5>
                  </div>

                  <div
                    className="row-container"
                    style={{ marginBottom: '16px' }}
                  >
                    <h5
                      className="title-text --size-16"
                      style={{ marginRight: '5px' }}
                    >
                      Freelancer:{' '}
                    </h5>
                    <h5 className="title-text --color-light --size-16">
                      {project.member.account_name}
                    </h5>
                  </div>

                  <div className="title-text --size-16">Message</div>
                  <TextField
                    multiline
                    name="report_message"
                    value={report.message}
                    minRows={5}
                    disabled
                  />

                  <div
                    className="title-text --size-16"
                    style={{ marginTop: 16 }}
                  >
                    Resources
                  </div>
                  <TextField
                    multiline
                    name="report_message"
                    value={report.resources}
                    sx={{ backgroundColor: '#EBE8E8' }}
                    minRows={5}
                    disabled
                  />

                  <div
                    className=""
                    style={{ textAlign: 'center', margin: '32px 0' }}
                  >
                    <button
                      className="my-button --button-gray"
                      style={{ margin: '0 5px' }}
                      onClick={
                        rejectProject
                      }
                      disabled={project.status == 4 || project.status == 3}

                    >
                      Reject
                    </button>

                    <button
                      className="my-button --button-green"
                      style={{ margin: '0 5px' }}
                      onClick={
                        // updateReport(REPORT_ACCEPTED, PROJECT_ACCEPTED)
                        acceptProject
                      }
                      disabled={project.status == 4 || project.status == 3}
                    >
                      Accept
                    </button>
                  </div>

                  <div
                    className="row-container"
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                  >
                    <div className="field-container">
                      <div className="title-text --size-16">Extra time</div>
                      <input
                        id="startDate"
                        type="date"
                        name="end_date"
                        className="label-text --size-20 my-input"
                        onChange={handleInputChange}
                        // min = {project.end_date}
                        value={project.end_date}
                      />
                    </div>
                    <div className="" style={{ textAlign: 'center', flex: 1 }}>
                      <button
                        className="my-button --button-green"
                        style={{ margin: '0 5px' }}
                        onClick={() =>
                          updateReport(REPORT_REMAIN, PROJECT_EXTEND_TIME)
                        }
                      disabled={project.status == 4 || project.status == 3}

                      >
                        Extend time
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
    </>
  );
};
