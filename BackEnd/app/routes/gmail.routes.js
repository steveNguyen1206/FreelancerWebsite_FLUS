module.exports = (app) => {
    const gmailController = require("../controllers/gmail.controller.js");

    var router = require("express").Router();

    router.post("/send-email", gmailController.sendEmail);

    app.use("/api/gmail", router);
}