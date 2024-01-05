module.exports = (app) => {
    const bid = require("../controllers/bid.controller.js");
    let router = require("express").Router();

    // Create a new Bid
    router.post("/", bid.create);

    // Retrieve all Bids by Project ID
    router.get("/findBidByProjectId/:project_id", bid.findBidByProjectId);

    // change bid status
    router.put("/changeBidStatus/:bid_id/:status", bid.changeBidStatus);

    // change other bid status
    router.put("/changeOtherBidStatus/:bid_id/:status", bid.changeOtherBidStatus);

    router.get("/getProjectPostfromBid/:bid_id", bid.getProjectPostfromBid);
  
    app.use("/api/bid", router);
  };