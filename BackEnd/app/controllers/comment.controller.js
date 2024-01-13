const db = require("../models");
const comment = db.comment_proj;
const Op = db.Sequelize.Op;
const user = db.user;
const review = db.review;

const getRatingClient = (user_id) => {
  return review
    .findAll({
      where: {
        user_reviewed: user_id,
        type: 1, // freelancer rating client
      },
    })
    .then((data) => {
      let sum = 0;
      let count = 0;
      data.forEach((element) => {
        sum += element.rating;
        count++;
      });
      return count === 0 ? 0 : sum / count;
    });
};

const getRatingFreelancer = (user_id) => {
  return review
    .findAll({
      where: {
        user_reviewed: user_id,
        type: 1, // client rating freelancer
      },
    })
    .then((data) => {
      let sum = 0;
      let count = 0;
      data.forEach((element) => {
        sum += element.rating;
        count++;
      });
      return count === 0 ? 0 : sum / count;
    });
};

exports.create = (req, res) => {
  if (!req.body.comment) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // create a comment
  const Comment = {
    comment: req.body.comment,
    proj_post_id: req.body.proj_post_id,
    user_id: req.userId,
    parent_id: req.body.parent_id,
  };

  // Save comment in the database
  comment
    .create(Comment)
    .then((data) => {
      // If parent_id is null, update it to be the id of the created comment
      // if (data.parent_id == null) {
      //   data.update({ parent_id: data.id }).then((updatedData) => {
      //     res.send(updatedData);
      //   });
      // } else {
        res.send(data);
      // }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the comment.",
      });
    });
};

exports.findCommentByProjectId = (req, res) => {
  const project_id = req.params.project_id;

  // get owner of project post
  let owner_id = 0;
  db.project_post
    .findOne({
      where: { id: project_id },
    })
    .then((data) => {
      owner_id = data.user_id;
    })
    .catch((err) => {
      console.log(err);
    });

  comment
    .findAll({
      where: {
        proj_post_id: project_id,
        parent_id: null,
      },
      include: [
        {
          model: user,
          attributes: ["id", "account_name", "profile_name", "avt_url"],
        },
      ],
    })
    .then((data) => {
      if (data.length > 0) {
        // loại bỏ các comment có parent_id != id
        // data = data.filter((comment) => comment.parent_id === comment.id);
        Promise.all(
          data.map((parentComment) => {
            return Promise.all([
              comment
                .findAll({
                  where: {
                    proj_post_id: project_id,
                    parent_id: parentComment.id,
                  },
                  include: [
                    {
                      model: user,
                      attributes: [
                        "id",
                        "account_name",
                        "profile_name",
                        "avt_url",
                      ],
                    },
                  ],
                })
                .then(async (childComments) => {
                  await Promise.all(
                    childComments.map((childComment) => {
                      return childComment.user_id === owner_id
                        ? getRatingClient(childComment.user_id).then(
                            (rating) => {
                              childComment.dataValues.userRating = rating;
                            }
                          )
                        : getRatingFreelancer(childComment.user_id).then(
                            (rating_1) => {
                              childComment.dataValues.userRating = rating_1;
                            }
                          );
                    })
                  );
                  parentComment.dataValues.childComments = childComments;
                }),
              parentComment.user_id === owner_id
                ? getRatingClient(parentComment.user_id).then((rating) => {
                    parentComment.dataValues.userRating = rating;
                  })
                : getRatingFreelancer(parentComment.user_id).then((rating) => {
                    parentComment.dataValues.userRating = rating;
                  }),
            ]);
          })
        )
          .then(() => {
            res.send(data);
          })
          .catch((err) => {
            res
              .status(500)
              .send({ message: "Error retrieving child comments" });
          });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error retrieving comment with project_id=" + project_id,
      });
    });
};
