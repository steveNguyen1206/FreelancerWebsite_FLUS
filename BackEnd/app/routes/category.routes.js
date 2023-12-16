const { authJwt } = require("../middleware");
const category_controller = require("../controllers/category.controller.js");

module.exports = (app) => {
  var router = require("express").Router();

  // get name of subcategory by id /subcategory/get_name/${id}`
    router.get("/get_name/:id", category_controller.getNameSubcategory);

    app.use("/api/subcategory", router)
};
