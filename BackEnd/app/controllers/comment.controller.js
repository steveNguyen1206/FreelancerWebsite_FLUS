const db = require("../models");
const comment = db.comment_proj;
const Op = db.Sequelize.Op;
const user = db.user;

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
    status: 1,
  };

  // Save comment in the database
  comment
    .create(Comment)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the comment.",
      });
    });
};

exports.findCommentByProjectId = async (req, res) => {
  const project_id = req.params.project_id;

  // get owner of project post
  let owner_id = 0;
  try {
    const project = await db.project_post.findOne({
      where: { id: project_id },
    });
    owner_id = project.user_id;

    const comments = await comment.findAll({
      where: {
        proj_post_id: project_id,
        parent_id: null,
        status: 1,
      },
      include: [
        {
          model: user,
          attributes: ["id", "account_name", "profile_name", "avt_url"],
        },
      ],
    });

    if (comments.length > 0) {
      await Promise.all(
        comments.map(async (parentComment) => {
          const childComments = await comment.findAll({
            where: {
              proj_post_id: project_id,
              parent_id: parentComment.id,
            },
            include: [
              {
                model: user,
                attributes: ["id", "account_name", "profile_name", "avt_url"],
              },
            ],
          });

          parentComment.dataValues.childComments = childComments;
        })
      );

      res.send(comments);
    } else {
      res.send(comments);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error retrieving comment with project_id=" + project_id,
    });
  }
};


exports.findAndChangeStatusByUserID = (req, res) => {
  const user_id = req.params.user_id;
  const status = req.params.status;

  comment
    .findAll({
      where: {
        user_id: user_id,
      },
    })
    .then((data) => {
      data.forEach((element) => {
        element.update({ status: status });
      });
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Error retrieving comment with user_id=" + user_id,
      });
    });
};
