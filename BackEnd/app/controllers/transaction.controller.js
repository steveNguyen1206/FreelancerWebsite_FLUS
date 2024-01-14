const db = require("../models");
const Transaction = db.transactions;
const Op = db.Sequelize.Op;
// const Project = db.projects;
// const ProjectNoti = db.projects_notis;
const ProjectController = require('./project.controller')
const projectReportController = require('./project_report.controller')
const IssueController = require('./issue.controller')


TRAN_CONFIGURE_PAID = 1
TRAN_ACCEPT_PROJECT = 1
TRAN_REJECT_PROJECT = 2
TRAN_RESOLVE_COMPLAINT = 3
TRAN_CREATE_PROJECT = 4

// Create and Save a new Tutorial
exports.createTransaction = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Tutorial
  const transaction = {
    amount: req.body.amount,
    sender_id: req.body.sender,
    receiver_id: req.body.receiver,
    project_id: req.body.project_id,
    transactionId: req.body.tranId,
    transactionType: req.body.tranType,
  };

  // Save Tutorial in the database
  Transaction.create(transaction)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

// Retrieve all Tutorials from the database.
// `http://localhost:8080/api/transaction`
exports.findAll = (req, res) => {
  const amount = req.query.amount;
  var condition = amount ? { amount: { [Op.like]: `%${amount}%` } } : null;

  Transaction.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Find a single Tutorial with an id
// `http://localhost:8080/api/transaction/${id}`
exports.findOne = (req, res) => {
  const id = req.params.id;

  Transaction.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Tutorial with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id
      });
    });
};


// Delete a Tutorial with the specified id in the request
// `http://localhost:8080/api/transaction/${id}`
exports.delete = (req, res) => {
  const id = req.params.id;

  Transaction.destroy({
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
//`http://localhost:8080/api/transaction`
exports.deleteAll = (req, res) => {
  Transaction.destroy({
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


exports.createTransactionAndUpdateProject = (req, res) => {
  // Validate request
  if (!req.body.tran_amount 
    || !req.body.tran_type 
    || !req.body.orderID 
    || !req.body.id
    || !req.body.project_name
    || !req.body.project_description
    || !req.body.start_date
    || !req.body.end_date
    || !req.body.budget
    || !req.body.status) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const id = req.body.id;

  const transaction = {
    amount: req.body.tran_amount,
    sender_id: req.body.userId,
    receiver_id: ADMIN_USER_ID,
    project_id: id,
    transactionId: req.body.orderID,
    type: req.body.tran_type
  }


  // Save Tutorial in the database
  Transaction.create(transaction)
    .then(trans_data => {
      // res.send(data);
      ProjectController.update(req, res);

    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};


exports.createTransactionAndAcceptProject = (req, res) => {
  // Validate request
  if (!req.body.costs
    || !req.body.receiverIds) {
    res.status(400).send({
      message: "missing information!"
    });
    return;
  }

  const projectId = req.params.projectId;

  const transaction = {
    amount: req.body.costs[0],
    sender_id: 1,
    receiver_id: req.body.receiverIds[0],
    project_id: projectId,
    transactionId: req.transactionId,
    type: 1,
  }

    // Save Transaction in the database
    Transaction.create(transaction)
    .then(trans_data => {
      // res.send(data);
      projectReportController.accept(req, res);

    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the transaction in accept project."
      });
    });
}


// create rejectTransaction and reject project status
exports.createTransactionAndRejectProject = (req, res) => {
  // Validate request
  if (!req.body.costs
    || !req.body.receivers) {
    res.status(400).send({
      message: "missing information!"
    });
    return;
  };

  const projectId = req.params.projectId;
  //  mapping multibe transtions basd on cost and receiver
  const transactions = req.body.costs.map((cost, index) => {
    return {
      amount: cost,
      sender_id: 1,
      receiver_id: req.body.receiverIds[index],
      project_id: projectId,
      transactionId: req.transactionIds[index],
      type: 2,
    }
  });

  // Save Transaction in the database
  Transaction.bulkCreate(transactions)
    .then( trans_data => {
      // res.send(data);
      projectReportController.reject(req, res);

    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the transaction in reject project."
      });
    });
}


exports.createTransactionAndResolveComplaint = (req, res) => {
  // Validate request
  if (!req.body.costs
    || !req.body.receiverIds) {
    res.status(400).send({
      message: "missing information!"
    });
    return;
  }

  const projectId = req.body.projectId;

  const transaction = {
    amount: req.body.costs[0],
    sender_id: 1,
    receiver_id: req.body.receiverIds[0],
    project_id: projectId,
    transactionId: req.transactionIds[0],
    type: 3,
  }

    // Save Transaction in the database
    Transaction.create(transaction)
    .then(trans_data => {
      // res.send(data);
      // projectReportController.accept(req, res);
      IssueController.acceptIssue(req, res);

    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the transaction in accept issue."
      });
    });
}