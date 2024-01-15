const db = require("../models");
const Subcategory = db.subcategories;
const project_post = db.project_post;
const Op = db.Sequelize.Op;

// Create and Save a new Category
exports.create = (req, res) => {
  // Validate request
  if (!req.body.subcategory_name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Category
  const subcategory = {
    subcategory_name: req.body.subcategory_name,
    categoryId: req.body.categoryId,
  };
  // console.log(category);
  // Save Category in the database
  Subcategory.create(subcategory)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Subcategory.",
      });
    });
};

// Retrieve all Category from the database.
exports.findAll = (req, res) => {
  const subcategory_name = req.query.subcategory_name;
  var condition = subcategory_name
    ? { subcategory_name: { [Op.like]: `%${subcategory_name}%` } }
    : null;

  Subcategory.findAll({ where: condition })
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

// Find a single Category with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Subcategory.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Tutorial with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Tutorial with id=" + id,
      });
    });
};

// Update a Category by the id in the request
exports.update = (req, res) => {
  const id = req.body.id;

  if (!req.body.subcategory_name) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  Subcategory.update(
    { subcategory_name: req.body.subcategory_name },
    {
      where: { id: id },
    }
  )
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Subcategory was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Subcategory with id=${id}. Maybe Subcategory was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Subcategory with id=" + id,
      });
    });
};

// Delete a Category with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Subcategory.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Subcategory was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Subcategory with id=${id}. Maybe Subcategory was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Subcategory with id=" + id,
      });
    });
};

// // Delete all Tutorials from the database.
// exports.deleteAll = (req, res) => {
//     Category.destroy({
//         where: {},
//         truncate: false
//     })
//         .then(nums => {
//             res.send({ message: `${nums} Category were deleted successfully!` });
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message:
//                     err.message || "Some error occurred while removing all categories."
//             });
//         });
// };



// get all subcategory of a project post
exports.getNamefromId = (req, res) => {
  const id = req.params.id;

  console.log("id: ", id);

  Subcategory.findByPk(id)
    .then((data) => {
      console.log("data: ", data);
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Subcategory with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Subcategory with id=" + id,
      });
    });
};