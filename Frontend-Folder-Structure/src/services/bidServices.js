import http from "./http-common";

const bidProject = (data) => {
    const req = {
      price: data.price,
      message: data.message,
      duration: data.duration,
      email: data.email,
      status: 0,
      user_id: data.user_id,
      proj_post_id: data.proj_post_id,
    }
    return http.post("/bid/", req);
}

const findBidByProjectId = (project_id) => {
    return http.get("/bid/findBidByProjectId/" + project_id);
}

const findBidByFreelancerId = (freelancer_id) => {
    return http.get("/bid/findBidByFreelancerId/" + freelancer_id);
}

const acceptBid = (bid_id) => {
    return http.get("/bid/acceptBid/" + bid_id);
}

const rejectBid = (bid_id) => {
    return http.put("/bid/rejectBid/" + bid_id);
}

const getNumOfBid = (project_id) => {
    return http.get("/bid/getNumOfBid/" + project_id);
}

const changeBidStatus = (bid_id, status) => {
    return http.put("/bid/changeBidStatus/" + bid_id + "/" + status);
}

const getDistinctUserIdsByStatus = (status) => {
    return http.get("/bid/getDistinctUserIdsByStatus/" + status);
}





const bidService = {
    bidProject,
    findBidByProjectId,
    findBidByFreelancerId,
    acceptBid,
    rejectBid,
    getNumOfBid,
    changeBidStatus,
    getDistinctUserIdsByStatus,
};

export default bidService;

