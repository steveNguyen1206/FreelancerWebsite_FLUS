const db = require("../models");
const ProjectPost = db.project_post;

isOwnerProjectPost = (req, res, next) => {
  const id = req.params.project_post_id;

  const userId = req.userId;

  ProjectPost.findByPk(id, { attributes: ["user_id"] })
    .then((data) => {
      console.log(data);
      if (data.user_id == userId) next();
      else
        res.status(403).send({
          mesage: "Permission denied! Required owner or member of the project.",
        });
    })
    .catch((error) => {
      res.status(500).send({ mesage: "Error retrieving project: ", error });
    });
};

isExpiredProjectPost = (req, res, next) => {
  ProjectPost.findAll({ where: { status: 1 } })
    .then((data) => {
      data.forEach((projectPost) => {
        const startDate = new Date(projectPost.start_date);
        const currentDate = new Date();
        if (startDate < currentDate) {
          ProjectPost.update({ status: 0 }, { where: { id: projectPost.id } });
        }
      });
      next();
    })
    .catch((err) => {
      console.log(err);
    });
};

const projectPostMiddleware = {
  isOwnerProjectPost: isOwnerProjectPost,
  isExpiredProjectPost: isExpiredProjectPost,
};
module.exports = projectPostMiddleware;
