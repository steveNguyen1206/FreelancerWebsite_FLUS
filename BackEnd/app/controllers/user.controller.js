const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body.account_name) {
    res.status(400).send({
      message: "Account name can not be empty!",
    });
    return;
  }

  const user = {
    account_name: req.body.account_name,
    password: req.body.password,
    profile_name: req.body.profile_name,
    phone_number: req.body.phone_number,
    nationality: req.body.nationality,
    user_type: req.body.user_type,
    email: req.body.email,
    avt_url: req.body.avt_url,
    social_link: req.body.social_link
  }

  // Save User in the database
  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

// Retrieve all User from the database
exports.findAll = (req, res) => {
  const profile_name = req.query.profile_name;
  var condition = profile_name ? { profile_name: { [Op.like]: `%${profile_name}%` } } : null;

  User.findAll({where : condition})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

// Find a single User with an id
exports.findOnebyId = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
};

exports.findOnebyAccountName = (req, res) => {
  const account_name = req.params.account_name;
  var condition = account_name ? { account_name: { [Op.eq]: `${account_name}` } } : null;

  User.findOne({where: {condition }})
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with account_name=${account_name}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with account_name=" + account_name
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};
