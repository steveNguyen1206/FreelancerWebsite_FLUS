const {verifyToken} = require('../middleware/authJwt.js');
const { isOwner, isMember } = require('../middleware/project.middleware.js');

module.exports = app => {
    const project = require("../controllers/project.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", project.create);
  
    // Retrieve project by id
    router.get("/mem/:projectId", [verifyToken, isMember], project.findMemberOne);
  
    router.get("/own/:projectId", [verifyToken, isOwner], project.findOwnerOne);
    router.get("/all-own", [verifyToken], project.findOwnerAll);
    router.get("/all-mem", [verifyToken], project.findMemberAll);


    // Retrieve a single Tutorial with id
    // router.get("/:id", project.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", [verifyToken], project.update);
  
    // Delete a Tutorial with id
    // router.delete("/:id", project.delete);
  
    // Delete all projects
    // router.delete("/", project.deleteAll);
  
    app.use('/api/project',  router);
  };