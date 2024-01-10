module.exports = app => {
    const subcategory = require("../controllers/subcategory.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Category
    router.post("/", subcategory.create);
  
    // Retrieve all Category
    router.get("/", subcategory.findAll);
  
    // // Retrieve all published Category
    // router.get("/published", category.findAllPublished);
  
    // Retrieve a single Category with id
    router.get("/:id", subcategory.findOne);
  
    // Update a Tutorial with id
    router.put("/", subcategory.update);
  
    // Delete a Category with id
    router.delete("/:id", subcategory.delete);
  
    // // Delete all Tutorials
    // router.delete("/", category.deleteAll);

    // get all subcategory of a project post
    router.get("/get_name/:id", subcategory.getNamefromId);

  
    app.use('/api/subcategory', router);
  };
  