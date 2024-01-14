const {verifyToken} = require('../middleware/authJwt.js')
const {isMember, isOwner, isMemberOrOwner} = require('../middleware/project.middleware.js')

module.exports = app => {
    const projectNotis = require("../controllers/project_notification.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    // router.post("/:id", [verifyToken, isMember], projectReport.create);
  
    // Retrieve all projects
    router.get("/:projectId", [verifyToken, isMemberOrOwner], projectNotis.findAll);

    // Retrieve a single Tutorial with id
    // router.get("/:id", project.findOne);
  
    // Update a Tutorial with id
    // router.put("/update/:id", [verifyToken, isMember], projectReport.update);
    // router.put("/accept/:id", [verifyToken, isOwner], projectReport.accept);
  
    // Delete a Tutorial with id
    // router.delete("/:id", project.delete);
  
    // Delete all projects
    // router.delete("/", project.deleteAll);
  
    app.use('/api/project-notis',  router);
  };
  