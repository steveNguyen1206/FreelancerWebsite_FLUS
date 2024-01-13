import http from "./http-common";

const getRatingClient = (id) => {
    return http.get(`/review/get_rating_client/${id}`);
    };

const getRatingFreelancer = (id) => {
    return http.get(`/review/get_rating_freelancer/${id}`);
    }


const createReview = (projectId, data, access_token) => {
    return http.post(`project/review/${projectId}`, data, {headers: {
        "Content-type": "application/json",
        "x-access-token": access_token,
    }});
    }

const reviewService = {
    getRatingClient,
    getRatingFreelancer,
    createReview,
};

export default reviewService;