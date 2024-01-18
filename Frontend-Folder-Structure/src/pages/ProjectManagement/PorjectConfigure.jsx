import React from 'react';
import './style.css';
import { TextField } from '@mui/material';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useState, useEffect } from 'react';
import { useProjectManageContext } from './ProjectManageProvider';
import paymentServices from '@/services/paymentServices';
import projectService from '@/services/projectServices';
import { useRef } from 'react';

export const ProjectConfigure = () => {
  const { project, setProject, error, setError } = useProjectManageContext();
  const [prePaidFull, setPrePaidFull] = useState(true);

  // useEffect(()=>{
  //   setPrePaidPayload({
  //     product_cost: project.budget,
  //     currenry_code: "USD",
  //     item_name: "Project Configure fee",
  //     description: "Prepaid for configure project id " + project.id,
  //     sku: project.id,
  //     email: project.owner ? project.owner.email : "",
  //     first_name: project.profile_name,
  //     last_name: project.profile_name,
  //     phone: "84" + (project.owner ? project.owner.phone_number: ""),
  //   })
  //   console.log(prepaidPayload);
  // }, [project])

  const reference = useRef();
  reference.project = project;
  reference.isFull = prePaidFull;

  // console.log("tessst", project.member.account_name)

  const isValid = () => {
    if (
      reference.project.start_date < currentDate ||
      reference.project.end_date < currentDate
    ) {
      setError('Start date and end date must be after today');
      return false;
    }
    if (reference.project.start_date > reference.project.end_date) {
      setError('Start date must be before end date');
      return false;
    }
    if (reference.project.project_description.length < 50) {
      console.log('description error');
      setError('Project requirements must be at least 50 characters');
      return false;
    }
    return true;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProject({ ...project, [name]: value });
    // setPrePaidPayload({...prepaidPayload, "product_cost": prePaidFull ? project.budget : project.budget * 30 / 100});
  };

  const handlePrepaidChange = (isFull) => {
    setPrePaidFull(isFull);
    // setPrePaidPayload({...prepaidPayload, "product_cost": isFull ? project.budget : project.budget * 30 / 100});
    // console.log(prepaidPayload);
  };
  function formatMoneyInput(event) {
    // Remove non-numeric characters
    const numericValue = event.target.value.replace(/[^0-9.]/g, '');

    // Format the input as a currency
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);

    console.log(numericValue);

    // Update the input value
    event.target.value = numericValue;
    handleInputChange(event);
  }

  const currentDate = new Date().toISOString().split('T')[0];

  // console.log("84" + project.owner.phone_number)

  const createOrder = async (data) => {
    if (!isValid()) return;
    const payload = {
      product_cost: reference.isFull
        ? reference.project.budget
        : (reference.project.budget * 30) / 100,
      currenry_code: 'USD',
      item_name: 'Project Configure fee',
      description: 'Prepaid for configure project id ' + reference.project.id,
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
    try {
      const payload = {
        ...data,
        ...reference.project,
        status: reference.isFull ? 2 : 1,
        tran_amount: reference.isFull
          ? reference.project.budget
          : (reference.project.budget * 30) / 100,
        userId: reference.project.owner_id,
        tran_type: '0',
        noti_title: 'The project is now ready.',
        noti_content:
          'The project was successfully be prepaid and completed all the configuration process. Project is now already in progress. Happy kicking off!',
      };
      const response = await paymentServices.paidAndUpdateProject(
        project.id,
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

  useEffect(() => {
    setError('');
  }, []);

  return (
    <form className="project-content-container">
      <div className="content-container">
        <div className="project-content-title">
          <h4 className="title-text --size-16">Project name</h4>
          <input
            name="name"
            type="text"
            className="label-text --size-20 my-input my-text-input"
            value={project.project_name}
          />
        </div>

        <div className="row-container">
          <div className="field-container">
            <div className="title-text --size-16">Date begin</div>
            {/* set minimun date to today */}
            <input
              type="date"
              name="start_date"
              className="label-text --size-20 my-input"
              value={project.start_date}
              min={currentDate}
              max={project.end_date}
              onChange={handleInputChange}
            />
            {/* <input id="startDate" type="date"name="start_date" className="label-text --size-20 my-input" value={project.start_date} onChange={handleInputChange}/> */}
          </div>

          <div className="field-container">
            <div className="title-text --size-16">Date end</div>
            <input
              type="date"
              name="end_date"
              className="label-text --size-20 my-input"
              value={project.end_date}
              min={project.start_date}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row-container">
          <div className="field-container">
            <div className="title-text --size-16">Project owner</div>
            <h5 className="label-text --size-20">
              {project.owner ? project.owner.account_name : ''}
            </h5>
          </div>

          <div className="field-container">
            <h4 className="title-text --size-16">Project member</h4>
            <h5 className="label-text --size-20">
              {project.member ? project.member.account_name : ''}
            </h5>
          </div>
        </div>

        <div className="project-requirement-container">
          <h4 className="title-text --size-20">Requirements</h4>
          <TextField
            multiline
            name="project_description"
            onChange={handleInputChange}
            value={project.project_description}
          />
        </div>

        <div className="row-container" style={{ alignItems: 'left' }}>
          <div className="field-container">
            <h4 className="title-text --size-16">Budget</h4>
            <div className="row-container" style={{ marginBottom: 0 }}>
              <input
                name="budget"
                type="text"
                className="label-text --size-20 my-input"
                onChange={formatMoneyInput}
                value={project.budget}
              />
              <h4 className="title-text --size-16">USD</h4>
            </div>
          </div>
        </div>

        <div className="row-container" style={{ alignItems: 'left' }}>
          <div className="field-container">
            <h4 className="title-text --size-16">Pre Pay (minimun 30%)</h4>
            <div className="row-container" style={{ marginBottom: 0 }}>
              <input
                type="text"
                className="label-text --size-20 my-input"
                value={
                  prePaidFull ? project.budget : (project.budget * 30) / 100
                }
                readOnly
              />
              <h4 className="title-text --size-16">USD</h4>
            </div>
          </div>
        </div>

        <div className="row-container">
          <div
            className="row-container"
            style={{ textAlign: 'start', marginBottom: 0 }}
          >
            <input
              type="radio"
              name="pre-paid"
              value="100"
              style={{ marginRight: 16 }}
              checked={prePaidFull ? true : false}
              onChange={() => handlePrepaidChange(true)}
            />

            <h3 className="title-text --size-20">Pay 100% and start</h3>
          </div>

          <div
            className="row-container"
            style={{ textAlign: 'start', marginBottom: 0 }}
          >
            <input
              type="radio"
              name="pre-paid"
              value="30"
              style={{ marginRight: 16 }}
              checked={prePaidFull ? false : true}
              onChange={() => handlePrepaidChange(false)}
            />
            <h3 className="title-text --size-20">Pay 30% and start</h3>
          </div>
        </div>
        <div style={{ height: '30px', width: '100%' }}>
          <div className="value-text --size-14 --color-error">{error}</div>
        </div>
        <PayPalButtons
          createOrder={(data, actions) => createOrder(data, actions)}
          onApprove={(data, actions) => onApprove(data, actions)}
        />
      </div>
    </form>
  );
};
