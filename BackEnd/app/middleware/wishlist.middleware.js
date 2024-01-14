const db = require("../models");
const wishlist = db.user_wishlist;

const isOwnerWishlist = (req, res, next) => {
  const id = req.params.projectPostId;

  const userId = req.userId;
  wishlist
    .findOne({
      where: { user_id: userId, project_post_id: id },
    })
    .then((data) => {
      if (data) {
        next();
      } else {
        res.status(403).send({
          message: "Require Owner Role!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};


const wishlistMiddleware = {
    isOwnerWishlist: isOwnerWishlist
}

module.exports = wishlistMiddleware;