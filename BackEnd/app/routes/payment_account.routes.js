module.exports = app => {
    const payment_account = require("../controllers/payment_account.controller.js");
    const {verifyToken} = require("../middleware/authJwt.js");
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", [verifyToken], payment_account.upsert);
  
    // Retrieve one by user id
    router.get("/", [verifyToken], payment_account.getOne);
  
    app.use('/api/payment_account', router);
  };
  