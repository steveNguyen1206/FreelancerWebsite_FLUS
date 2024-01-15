const {verifyToken} = require('../middleware/authJwt.js');
const {isNotOwner, isOwnerProjectPost, isOwnerProjectPostOrBidder} = require('../middleware/bid.middleware.js');
module.exports = (app) => {
    const bid = require("../controllers/bid.controller.js");
    let router = require("express").Router();

    // Create a new Bid
    router.post("/",[verifyToken, isNotOwner], bid.create);

    // Retrieve all Bids by Project ID
    router.get("/findBidByProjectId/:project_id", bid.findBidByProjectId);

    // change bid status
    router.put("/acceptBid/:bid_id",[verifyToken, isOwnerProjectPost], bid.acceptBid);
    router.put("/rejectBid/:bid_id",[verifyToken, isOwnerProjectPost], bid.rejectBid);

    // change other bid status
    router.put("/changeOtherBidStatus/:bid_id/:status",[verifyToken, isOwnerProjectPost], bid.changeOtherBidStatus);

    
    router.get("/getProjectPostfromBid/:bid_id", [verifyToken], bid.getProjectPostfromBid);

    router.get("/getDistinctUserIdsByStatus/:bid_status", bid.getDistinctUserIdsByStatus);
  
  
    app.use("/api/bid", router);
  };