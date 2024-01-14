module.exports = (app) => {
    const gmailController = require("../controllers/gmail.controller.js");

    var router = require("express").Router();

    router.post("/send-email", gmailController.sendEmailToFreelancer);

    app.use("/api/gmail", router);
}