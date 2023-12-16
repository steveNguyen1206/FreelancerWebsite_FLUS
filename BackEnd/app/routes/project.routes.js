const authJwt = require('../middleware/authJwt.js')

module.exports = app => {
    const project = require("../controllers/project.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", project.create);
  
    // Retrieve all projects
    router.get("/", project.findAll);
  
    // Retrieve a single Tutorial with id
    // router.get("/:id", project.findOne);
  
    // Update a Tutorial with id
    // router.put("/:id", project.update);
  
    // Delete a Tutorial with id
    // router.delete("/:id", project.delete);
  
    // Delete all projects
    // router.delete("/", project.deleteAll);
  
    app.use('/api/project',  router);
  };