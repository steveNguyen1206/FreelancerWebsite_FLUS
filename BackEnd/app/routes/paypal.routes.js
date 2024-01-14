const {verifyToken, isAdmin} = require('../middleware/authJwt.js')
const {isMember, isOwner} = require('../middleware/project.middleware.js')

module.exports = (app) => {
    const paypalController = require("../controllers/paypal.controller.js");

    var router = require("express").Router();

    router.post("/create-orders", paypalController.apiCreateOrders);

    router.post("/orders/:orderID/capture", paypalController.apiCaptureOrder);
    router.post("/createPayoutBatch", paypalController.apiCreatePayoutBatch);
    router.post("/prePaidCreateProject/:orderID/:projectId", [verifyToken, isOwner], paypalController.apiPrePaidCreateProject);
    router.post("/acceptProject/:projectId", [verifyToken, isOwner], paypalController.apiAcceptProject);
    router.post("/rejectProject/:projectId", [verifyToken, isOwner], paypalController.apiRejectProject);
    router.post("/resolveComplaint/:issueId", [verifyToken, isAdmin], paypalController.apiResolveComplaint);

    app.use("/api/paypal", router);
}