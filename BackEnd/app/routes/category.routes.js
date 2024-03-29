const { authJwt, upload } = require("../middleware");
const { verifyToken, isAdmin } = require("../middleware/authJwt.js");

module.exports = app => {
    const category = require("../controllers/category.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Category
    // router.post("/", category.create);
     // Create a new freelancer_post
     router.post("/", upload.single("img"), category.create);
  
    // Retrieve all Category
    router.get("/", category.findAll);
  
    // Retrieve all Categories with their Subcategories from the database.
    router.get("/all/:searchKey",[verifyToken, isAdmin], category.findAllCategoryInfo);

    router.get("/all/",[verifyToken, isAdmin], category.findAllCategoryInfo);

    // // Retrieve all published Category
    // router.get("/published", category.findAllPublished);
  
    // Retrieve a single Category with id
    router.get("/:id", category.findOne);
  
    // Update a Category with id
    router.put("/",[verifyToken, isAdmin], category.update);
  
    // Delete a Category with id
    router.delete("/:id",[verifyToken, isAdmin], category.delete);
  
    // // Delete all Tutorials
    // router.delete("/", category.deleteAll);
  
    app.use('/api/category', router);
  };
  