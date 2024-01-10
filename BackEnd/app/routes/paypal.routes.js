const {verifyToken} = require('../middleware/authJwt.js')
const {isMember, isOwner} = require('../middleware/project.middleware.js')

module.exports = (app) => {
    const paypalController = require("../controllers/paypal.controller.js");

    var router = require("express").Router();

    router.post("/create-orders", paypalController.apiCreateOrders);

    router.post("/orders/:orderID/capture", paypalController.apiCaptureOrder);
    router.post("/createPayoutBatch", paypalController.apiCreatePayoutBatch);
    router.post("/orders/prePaidCreateProject/:orderID/:projectId", [verifyToken, isOwner], paypalController.apiPrePaidCreateProject);
    router.post("/orders/acceptProject/:projectId", [verifyToken, isOwner], paypalController.apiAcceptProject);

    app.use("/api/paypal", router);
}