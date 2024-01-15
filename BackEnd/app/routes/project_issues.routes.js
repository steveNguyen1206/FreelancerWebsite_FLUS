// write router for issue controller

// Path: BackEnd/app/routes/project_isses.routes.js
const issuesController = require("../controllers/issue.controller.js");
const {verifyToken, isAdmin} = require("../middleware/authJwt.js");
const {isMemberOrOwner} = require("../middleware/project.middleware.js");

module.exports = (app) => {
    var router = require("express").Router();

    router.post("/:projectId", [verifyToken, isMemberOrOwner], issuesController.create);
    router.put("/:projectId", [verifyToken, isAdmin], issuesController.update);
    router.get("/find-all/:projectId", [verifyToken, isAdmin], issuesController.findAll);
    router.get("/find-one/:projectId/:id", [verifyToken, isAdmin], issuesController.findOne);

    app.use("/api/issues", router);
}