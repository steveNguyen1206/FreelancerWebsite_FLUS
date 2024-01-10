const db = require("../models");
const Project = db.projects;
const Op = db.Sequelize.Op;
const User = db.Sequelize.user;
const Transaction = db.transactions;
const ProjectNoti = db.projects_notis;

const { createTransaction } = require('../controllers/transaction.controller.js')

ADMIN_USER_ID = 1

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name || !req.body.description || !req.body.startDate || !req.body.endDate || ! req.body.budget || !req.body.owner || ! req.body.member) {
    res.status(400).send({
      message: "Missing information!",
    });
    return;
  }

  //   const currentDate = new Date();
  //   const currentDateString = currentDate.toISOString().split('T')[0];

  // Create a Tutorial
  const project = {
    project_name: req.body.name,
    project_description: req.body.description,
    start_date: req.body.startDate,
    end_date: req.body.endDate,
    budget: req.body.budget,
    status: 0,
    owner_id: req.body.owner,
    member_id: req.body.member,
    created_bid_id: req.body.bid_id,
    created_contact_id: req.body.contact_id,
    tag_id: req.body.tag_id,
  };

  console.log(req.body);

  // Save Tutorial in the database
  Project.create(project)
    .then((project_data) => {
      const notification = {
        title: "Project was created",
        content: "This is the first begining of your project. Happy freelancing!",
        creator_id: req.body.owner,
        project_id: project_data.id
      }

      ProjectNoti.create(notification)
        .then(noti_data => {
          res.send(project_data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occurred while creating project notification.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Project.",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {

  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Project.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving projects.",
      });
    });
};

// Find a single Tutorial with an id
exports.findMemberOne = (req, res) => {
  const id = req.params.projectId;

  Project.findByPk(id, {
    include: [
      {
        model: db.user,
        as: 'member',
        attributes: ['account_name']
      },
      {
        model: db.user,
        as: 'owner',
        attributes: ['account_name']
      },
    ]
  })
    .then(data => {
      if (data) {
        console.log(req.userId)
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Project with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Priject with id=" + id,
      });
    });
};

// Find a single Tutorial with an id
exports.findOwnerOne = (req, res) => {
  const id = req.params.projectId;

  Project.findByPk(id, {
    include: [
      {
        model: db.user,
        as: 'member',
        attributes: ['account_name', "email"]
      },
      {
        model: db.user,
        as: 'owner',
        attributes: ['account_name', "email", "phone_number"]
      },
    ]
  })
    .then(data => {
      if (data) {
        console.log(req.userId)
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Project with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Priject with id=" + id,
      });
    });
};


// Find a all project with given user menber id
exports.findMemberAll = (req, res) => {
  console.log("test get all member project")
  const userId = req.userId;
  console.log("userid ", userId)
  Project.findAll({ where: { member_id: userId }, attributes: ['id', 'project_name', 'start_date', 'end_date', 'budget', 'status'] })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Project in which user id=${id} is member.`
        });
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message: "Error retrieving Project with error: " + err
      });
    });
};

// Find a single Tutorial with an id
exports.findOwnerAll = (req, res) => {
  const userId = req.userId;

  Project.findAll({ where: { owner_id: userId }, attributes: ['id', 'project_name', 'start_date', 'end_date', 'budget', 'status'] })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Project in which user id=${id} is owner.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Project with error: " + err
      });
    });
};


// Find a all project with given user menber id
exports.findMemberAll = (req, res) => {
  console.log("test get all member project")
  const userId = req.userId;
  console.log("userid ", userId)
  Project.findAll({ where: { member_id: userId }, attributes: ['id', 'project_name', 'start_date', 'end_date', 'budget', 'status'] })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Project in which user id=${id} is member.`
        });
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message: "Error retrieving Project with error: " + err
      });
    });
};

// Find a single Tutorial with an id
exports.findOwnerAll = (req, res) => {
  const userId = req.userId;

  Project.findAll({ where: { owner_id: userId }, attributes: ['id', 'project_name', 'start_date', 'end_date', 'budget', 'status'] })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Project in which user id=${id} is owner.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Project with error: " + err
      });
    });
};

// Update a project by the id in the request
exports.update = (req, res) => {
  const projectId = req.params.projectId;

  const update = {
    project_name: req.body.project_name,
    project_description: req.body.project_description,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    budget: req.body.budget,
    status: req.body.status
  };

  Project.update(update, {
    where: { id: projectId }
  })
    .then(num => {
      if (num == 1) {
        const notification = {
          title: req.body.noti_title,
          content: req.body.noti_content,
          creator_id: req.userId,
          project_id: projectId,
          report_id: req.body.report_id
        }


        ProjectNoti.create(notification)
          .then(noti_data => {
            // res.send(project_data);
            res.send({
              message: "Project was updated successfully."
            });
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating project notification."
            });
          });

      } else {
        res.send({
          message: `Cannot update project with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating project with id =  ${projectId}.`
      });
    });
};



// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.projectId;

  Project.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id,
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Project.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Tutorials were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
};

// find all published Tutorial
exports.findAllPublished = (req, res) => {
  Project.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.createNull = (req, res) => {
  // Create a Project
  const project = {
    project_name: "",
    project_description: "",
    start_date: "01/01/2001",
    end_date: "02/02/2002",
    budget: 0,
    status: 0,
  };

  // Save Project in the database
  Project.create(project)
    .then((data) => {
      return res.json(data.id);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};
