import http from "./http-common";

const getRating = (id) => {
    return http.get(`/review/get_rating/${id}`);
    };

const createReview = (projectId, data, access_token) => {
    return http.post(`project/review/${projectId}`, data, {headers: {
        "Content-type": "application/json",
        "x-access-token": access_token,
    }});
    }

const reviewService = {
    createReview,
    getRating,
};

export default reviewService;