import http from "./http-common";

const createOrder = (data) => {
  return http.post("/paypal/create-orders", data);
};

const onAprrove = (data) => {
    return http.post(`/paypal/orders/${data.orderID}/capture`, {orderID: data.orderID});
  };


const paidAndUpdateProject = (projectId, data, access_token) => {
  console.log(data);
  return http.post(`/paypal/prePaidCreateProject/${data.orderID}/${projectId}`, data, {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
};
  
const acceptProject = (projectId, data, access_token) => {
  return http.post(`/paypal/acceptProject/${projectId}`, data, {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
}

const rejectProject = (projectId, data, access_token) => {
  return http.post(`/paypal/rejectProject/${projectId}`, data, {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
}

const createPayoutBatch = (data) => {
  return http.post('/paypal/createPayoutBatch', data);
}

const resolveComplaint = (issueId, data, accessToken) => {
  return http.post(`/paypal/resolveComplaint/${issueId}`, data, {headers: {
    "Content-type": "application/json",
    "x-access-token": accessToken,
  }});
}

const createPaymentAccount = (data, access_token) => {
  return http.post(`/payment_account`, data, {headers: {
    "Content-type": "application/json",
    "x-access-token": access_token,
  }});
}


const paymentServices = {
 createOrder,
 onAprrove,
 createPayoutBatch,
 paidAndUpdateProject,
 acceptProject,
 rejectProject,
 resolveComplaint,
 createPaymentAccount
 
};

export default paymentServices;
