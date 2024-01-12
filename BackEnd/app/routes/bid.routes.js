module.exports = (app) => {
    const bid = require("../controllers/bid.controller.js");
    let router = require("express").Router();

    // Create a new Bid
    router.post("/", bid.create);

    // Retrieve all Bids by Project ID
    router.get("/findBidByProjectId/:project_id", bid.findBidByProjectId);

    // change bid status
    router.put("/changeBidStatus/:bid_id/:status", bid.changeBidStatus);

    router.get("/getDistinctUserIdsByStatus/:bid_status", bid.getDistinctUserIdsByStatus);
  
    app.use("/api/bid", router);
  };