const {verifyToken} = require('../middleware/authJwt.js')
const {isMember, isOwner, isMemberOrOwner} = require('../middleware/project.middleware.js')

module.exports = app => {
    const projectReport = require("../controllers/project_report.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/:projectId", [verifyToken, isMember], projectReport.create);
  
    // Retrieve all projects
    router.get("/get-one/:projectId/:reportId", [verifyToken, isMemberOrOwner], projectReport.findOneById);
    router.get("/newest/:projectId", [verifyToken, isMemberOrOwner], projectReport.findNewest);

    // Retrieve a single Tutorial with id
    // router.get("/:id", project.findOne);
  
    // Update a Tutorial with id
    router.put("/update/:projectId", [verifyToken, isOwner], projectReport.update);
    // router.put("/accept/:projectId", [verifyToken, isOwner], projectReport.accept);
  
    // Delete a Tutorial with id
    // router.delete("/:id", project.delete);
  
    // Delete all projects
    // router.delete("/", project.deleteAll);
  
    app.use('/api/project-report',  router);
  };
  