const db = require("../models");
const User = db.user;
const Subcategory = db.subcategories;
const Op = db.Sequelize.Op;

// add a subcategory to a user by user id and subcategory id
exports.create = async (req, res) => {
  console.log("======== ADD A SUBCATEGORY TO A USER =========");
  const userId = req.body.userId;
  const subcategoryId = req.body.subcategoryId;

  console.log("USER: " + userId);
  console.log("SUBCATEGORY: " + subcategoryId);

  // Validate request
  if (!userId || !subcategoryId) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  try {
    // Get User by id
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).send({
        message: "User not found!",
      });
      return;
    }

    // Get Subcategory by id
    const subcategory = await Subcategory.findByPk(subcategoryId);
    if (!subcategory) {
      res.status(404).send({
        message: "Subcategory not found!",
      });
      return;
    }

    // Add the subcategory to the user
    const addSubcategoryToUser = await user.addSubcategory(subcategory);
    if (!addSubcategoryToUser) {
      res.status(500).send({
        message: "Error: Maybe the subcategory is already added to the user.",
      });
      return;
    }

    res.send("Subcategory added to the user successfully!");
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Error: Maybe the subcategory is already added to the user.",
    });
    console.log(err);
  }
};

// Retrieve all subcategories of a user by user ID
exports.findAll = (req, res) => {
  console.log("======== GET ALL SUBCATEGORIES OF A USER =========");
  const id = req.params.id;

  console.log("USER: ", id);

  User.findByPk(id, {
    include: Subcategory, // Include the associated Subcategory model
  })
    .then((user) => {
      if (user) {
        const subcategories = user.subcategories;
        console.log(subcategories);
        res.send(subcategories);
      } else {
        // User with the given ID not found
        console.log("User with the given ID not found");
        res.status(404).send({
          message: "User with the given ID not found",
        });
      }
    })
    .catch((error) => {
      // Handle any errors
      console.log(error);
      res.status(500).send({
        message: "Error retrieving subcategories of user with id=" + id,
      });
    });
};

// delete a subcategory of a user by user id and subcategory id
exports.delete = async (req, res) => {
  console.log("======== DELETE A SUBCATEGORY OF A USER =========");
  const userId = req.params.userId;
  const subcategoryId = req.params.subcategoryId;

  console.log("USER: " + userId);
  console.log("SUBCATEGORY: " + subcategoryId);

  // Validate request
  if (!userId || !subcategoryId) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  try {
    // Get User by id
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).send({
        message: "User not found!",
      });
      return;
    }

    // Get Subcategory by id
    const subcategory = await Subcategory.findByPk(subcategoryId);
    if (!subcategory) {
      res.status(404).send({
        message: "Subcategory not found!",
      });
      return;
    }

    // Remove the subcategory from the user
    const removeSubcategoryOfUser = await user.removeSubcategory(subcategory);
    if (!removeSubcategoryOfUser) {
      res.status(500).send({
        message:
          "Error: Maybe the user doesn't have this subcategory.",
      });
      return;
    }
    
    res.send("Subcategory deleted from the user successfully!");
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Error: Maybe the user doesn't have this subcategory.",
    });
    console.log(err);
  }
};