import { http } from "./http-common";

const create = (data) => {
    const access_token = localStorage.getItem('AUTH_TOKEN');
    console.log("access_token: ", access_token);
    return http.post("/contact", data, {
        headers: {
            "Content-type": 'application/json',
            "x-access-token": access_token
            },
    });
};

const findAll = () => {
  return http.get("/contact");
};

// findOnebyId
const findOne = id => {
  return http.get(`/contact/${id}`);
};

const findAllBids = (freelancer_post_id) => {
  return http.get(`/contact/allbids/${freelancer_post_id}`);
};

const findZeroStatusBids = freelancer_post_id => {
  return http.get(`/contact/allzerobids/${freelancer_post_id}`);
};

const countBids = freelancer_post_id => {
  return http.get(`/contact/countbids/${freelancer_post_id}`);
}

const changeContactStatus = (contact_id, status) => {
  const access_token = localStorage.getItem('AUTH_TOKEN');
  // console.log("test token in change contact", access_token)
  console.log("test contact id", contact_id)
  return http.put("/contact/changeContactStatus/" + contact_id + "/" + status, {}, {
    headers: {
      "Content-type": "application/json",
      "x-access-token": access_token,
    },
  });
}

const showContactByContactId = contact_id => {
  return http.get(`/contact/showContact/${contact_id}`);
}

const getDistinctClientIdsByStatus = status => {
  return http.get(`/contact/getDistinctClientIdsByStatus/${status}`);
};

const contactService = {
    create,
    findAll,
    findOne,
    findAllBids,
    getDistinctClientIdsByStatus,    
    countBids,
    findZeroStatusBids,
    changeContactStatus,
    showContactByContactId
};

export default contactService;
