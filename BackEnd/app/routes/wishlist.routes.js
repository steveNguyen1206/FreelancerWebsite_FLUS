module.exports = (app) => {
    const wishlist = require("../controllers/wishlist.controller.js");
    let router = require("express").Router();
  
    // Create a new Wishlist
    router.post("/:userId/:projectPostId", wishlist.create);
  
    // Delete a Wishlist
    router.delete("/:userId/:projectPostId", wishlist.delete);

    // get all wishlist of a user
    router.get("/get_wishlist/:userId", wishlist.findAllWishlistByUserId);

    // check is existed in wishlist
    router.get("/is_existed/:userId/:projectPostId", wishlist.isExisted);
  
    // use /api/wishlist
    app.use("/api/wishlist", router);
  };