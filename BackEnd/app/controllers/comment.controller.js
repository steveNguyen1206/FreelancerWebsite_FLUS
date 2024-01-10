const db = require("../models");
const comment = db.comment_proj;
const Op = db.Sequelize.Op;

// create comment
exports.create = (req, res) => {
    // Validate request
    if (!req.body.comment) {
        res.status(400).send({
        message: "Content can not be empty!",
        });
        return;
    }
    
    // Create a comment
    const comment_proj = {
        comment: req.body.comment,
        proj_post_id: req.body.proj_post_id,
        user_id: req.body.user_id,
    };
    console.log(category);
    // Save comment in the database
    comment.create(comment_proj)
        .then((data) => {
        res.send(data);
        })
        .catch((err) => {
        res.status(500).send({ message: err.message || "Some error occurred while creating the comment." });
        });
    }

// Retrieve all comment from the database.
exports.findAll = (req, res) => {
    const comment = req.query.comment;
    var condition = comment ? { comment: { [Op.like]: `%${comment}%` } } : null;
  
    comment.findAll({ where: condition })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving comment." });
      });
  };

// Find a single comment with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    comment.findByPk(id)
      .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({ message: "Not found comment with id " + id });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Error retrieving comment with id=" + id });
      });
  };

exports.findCommentByProjectId = (req, res) => {
    const project_id = req.params.project_id;
    var condition = project_id ? { proj_post_id: { [Op.eq]: `${project_id}` } } : null;
  
    comment.findAll({ where: condition })
      .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({ message: "Not found comment with project_id " + project_id });
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Error retrieving comment with project_id=" + project_id });
      });
  }

