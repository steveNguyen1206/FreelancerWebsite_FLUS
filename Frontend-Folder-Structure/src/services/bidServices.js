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

const changeOtherBidStatus = (bid_id, status) => {
    return http.put("/bid/changeOtherBidStatus/" + bid_id + "/" + status);
}

const getProjectPostfromBid = (bid_id) => {
    return http.get("/bid/getProjectPostfromBid/" + bid_id);
}




const bidService = {
    bidProject,
    findBidByProjectId,
    findBidByFreelancerId,
    acceptBid,
    rejectBid,
    getNumOfBid,
    changeBidStatus,
    changeOtherBidStatus,
    getProjectPostfromBid,
};

export default bidService;

