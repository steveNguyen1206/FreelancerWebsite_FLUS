const db = require("../models");
const ProjectPost = db.project_post;
const Bid = db.bid;

const isNotOwner = (req, res, next) => {
  const project_post_id = req.body.proj_post_id;
  const userId = req.userId;

  ProjectPost.findByPk(project_post_id)
    .then((data) => {
      console.log(data);
      if (userId != data.user_id) next();
      else
        res
          .status(403)
          .send({ mesage: "Permission denied! Owner cannot bid." });
    })
    .catch((error) => {
      res.status(500).send({ mesage: "Error retrieving project: ", error });
    });
};

const isOwnerProjectPost = (req, res, next) => {
    const bid_id = req.params.bid_id;
    const userId = req.userId;
  
    Bid.findByPk(bid_id, { attributes: ["proj_post_id"] })
      .then((data) => {
        return ProjectPost.findByPk(data.proj_post_id, { attributes: ["user_id"] });
      })
      .then((projectPost) => {
        if (projectPost.user_id == userId) {
          next();
        } else {
          res.status(403).send({
            message: "Permission denied! Required owner or member of the project.",
          });
        }
      })
      .catch((error) => {
        res.status(500).send({ message: "Error retrieving project: ", error });
      });
  };

const isOwnerProjectPostOrBidder = (req, res, next) => {
  const bid_id = req.params.bid_id;

  const userId = req.userId;

  Bid.findByPk(bid_id, { attributes: ["user_id"] })
    .then((data) => {
      console.log(data);
      if (data.user_id == userId) next();
      else
        res
          .status(403)
          .send({
            mesage:
              "Permission denied! Required owner or member of the project.",
          });
    })
    .catch((error) => {
      res.status(500).send({ mesage: "Error retrieving project: ", error });
    });
};

const bidMiddleware = {
  isNotOwner: isNotOwner,
  isOwnerProjectPost: isOwnerProjectPost,
  isOwnerProjectPostOrBidder: isOwnerProjectPostOrBidder,
};
module.exports = bidMiddleware;
