const { where } = require("sequelize");
const db = require("../models");
const Project = db.projects;
const Op = db.Sequelize.Op;
const User = db.Sequelize.user;
const projectNotis = db.projects_notis;


// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title || !req.body.content ) {
    res.status(400).send({
      message: "Missing information!"
    });
    return;
  }

  const projectId = req.params.id;
  const project_noti = {
    title: req.body.title,
    content: req.body.content,
    project_id: projectId,
    creator_id: "1", //test
  };

//   console.log(req.body);

  // Save Tutorial in the database
  projectNotis.create(project_noti)
    .then(noti_data => {
          res.send(noti_data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating project notification."
      });
    });
};

// Find all notifications with an project id
exports.findAll = (req, res) => {
    const id = req.params.projectId;
    console.log("tesst", id);
    projectNotis.findAll({
        where: {project_id: id}, 
        include: [
          {
            model: db.user,
            attributes: ['account_name']
          }]
    })
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(400).send({
            message: `Error occur when creating project notification. This project havent had a notification yet.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: `Error retrieving project report with project id = ${id}, error: ${err}`
        });
      });
  };

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};


