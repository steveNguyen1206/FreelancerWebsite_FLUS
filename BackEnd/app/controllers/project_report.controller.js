const { where } = require("sequelize");
const db = require("../models");
const projectController = require('./project.controller')
const Project = db.projects;
const Op = db.Sequelize.Op;
const User = db.Sequelize.user;
const projectReport = db.projects_reports;
const ProjectNoti = db.projects_notis;


// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.message || !req.body.resources ) {
    res.status(400).send({
      message: "Missing information!"
    });
    return;
  }

  const projectId = req.params.projectId;
  // console.log("tesst", projectId)
  const project_report = {
    message: req.body.message,
    resources: req.body.resources,
    status: 0,
    project_id: projectId
  };

  // console.log(project_report);

//   console.log(req.body);

  // Save Tutorial in the database
  projectReport.create(project_report)
    .then(report_data => {
          // res.send(report_data);

          const notification = {
            title: "A report was added to the project",
            content: "A report has been successully added to this project. Project owner have to check this report and give a judgment within 5 days after this notification. Watch your calender and happy freelancing!",
            creator_id:  req.userId,
            project_id: projectId,
            report_id: report_data.id,
          }
    
          ProjectNoti.create(notification)
            .then(noti_data=> {
              res.send(report_data);
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while creating project notification."
              });
            });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Project."
      });
    });
};

// Find a single Tutorial with an id
exports.findOneById = (req, res) => {
    const projectId = req.params.projectId;
    const reportId = req.params.reportId;
    console.log(projectId, reportId)
  
    projectReport.findOne({
        where: {project_id: projectId, id: reportId}
    })
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(400).send({
            message: `This project havent had a report yet. contact your freelancer for more information.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving project report with project id=" + id
        });
      });
  };


  // Find a single Tutorial with an id
exports.findNewest = (req, res) => {
  const projectId = req.params.projectId;

  projectReport.findOne({
      where: {project_id: projectId}, 
      order: [['createdAt', 'DESC']]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(400).send({
          message: `This project havent had a report yet. contact your freelancer for more information.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving project report with project id=" + id
      });
    });
};


// Update a project by the id in the request
exports.update = (req, res) => {
  const projectId = req.params.projectId;
  const reportId = req.body.report_id;

  Project.findByPk(projectId)
  .then(project_data => {
    if(project_data.status == 2 && req.body.report_status != 1 && req.body.status != 3)
    {

      const update = {
      // message: req.body.message,
      // resources: req.body.resources,
      status: req.body.report_status,
      };
    
      projectReport.update(update, {where: {project_id: projectId, id: reportId}})
        .then(data => {
          // res.send(data)
          projectController.update(req, res);
        })
        .catch(err => {
          res.status(500).send({
              message: "Error updating project report with project id=" + projectId
            });
        })
        
    }
    else {
      res.status(500).send({
        message: "Can not update project. The status of this project is not 'In progress' or the status of this project is 'Finished'"
      });
    }
  }).catch(error => {
    res.status(500).send({
      message: "Error retriveing project with project, " + error
    });
  })

};

// Update a project by the id in the request
exports.accept = async (req, res) => {
  const projectId = req.params.projectId;
  const reportId = req.body.report_id;
  const report_update = {
    status: 1,
  };

  projectReport.update(report_update, {where: {project_id: projectId, id: reportId}})
    .then(data => {
        req.body.status = 3;
        projectController.update(req, res);
    })
    .catch(err => {
      res.status(500).send({
          message: "Error updating project report with project: " + err
        });
    })
    
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.projectId;

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


