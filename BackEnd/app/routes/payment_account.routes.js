module.exports = app => {
    const payment_account = require("../controllers/payment_account.controller.js");
    const {verifyToken} = require("../middleware/authJwt.js");
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", [verifyToken], payment_account.create);
  
    // Retrieve all Tutorials

  
    app.use('/api/payment_account', router);
  };
  