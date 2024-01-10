const db = require("../models");
const cloudinary = require("../config/cloudinary.config");
const upload = require("../middleware/multer");
const multer = require("multer");
const User = db.user;
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// Retrieve all User from the database
exports.findAll = (req, res) => {
  const profile_name = req.query.profile_name;
  var condition = profile_name
    ? { profile_name: { [Op.like]: `%${profile_name}%` } }
    : null;

  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Find a single User with an id
exports.findOnebyId = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

exports.findOnebyAccountName = (req, res) => {
  const account_name = req.params.account_name;
  var condition = account_name
    ? { account_name: { [Op.eq]: `${account_name}` } }
    : null;

  User.findOne({ where: condition })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with account_name=${account_name}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with account_name=" + account_name,
      });
    });
};

exports.findOnebyEmail = (req, res) => {
  const email = req.params.email;
  var condition = email ? { email: { [Op.eq]: `${email}` } } : null;

  User.findOne({ where: condition })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with email=${email}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with email=${email}",
      });
    });
};

// Define the getPagination function
function getPagination(page, size) {
  // page > 0, size > 0
  const limit = size;
  const offset = (page - 1) * size;
  return { limit, offset };
}

exports.findUsersbyPage = (req, res) => {
  console.log("\nMY PARAMS:", req.params);
  const { page, size, searchKey } = req.params; // page: 1..n, size: 1..m
  console.log(
    "FFFFFFFFFFFFFFFFFFFF",
    "page: " + page + ", size: " + size + ", searchKey: " + searchKey
  );

  // condition to check searchKey in account_name or profile_name
  var condition =
    searchKey && searchKey !== "undefined" && searchKey !== ""
      ? {
          [Op.or]: [
            { account_name: { [Op.like]: `%${searchKey}%` } },
            { profile_name: { [Op.like]: `%${searchKey}%` } },
          ],
        }
      : null;

  const { limit, offset } = getPagination(parseInt(page), parseInt(size));

  // Find all users with condition by page
  User.findAndCountAll({ where: condition, limit, offset })
    .then((data) => {
      const { rows: users, count: totalItems } = data;

      // Extract only the necessary information from each user
      const simplifiedUsers = users.map((user) => ({
        id: user.id,
        avt_url: user.avt_url,
        account_name: user.account_name,
        profile_name: user.profile_name,
        reported_times: user.reported_times,
        createdAt: user.createdAt,
        status: user.status,
      }));

      const response = {
        totalItems,
        users: simplifiedUsers,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalItems / limit),
      };

      res.send(response);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};



exports.updateAvatar = async (req, res) => {
  const id = 1;
  console.log(req.params);

  // đoạn code này để test upload hình ảnh lên cloud mà ko cập nhật lại bảng user, do chấn chưa đăng ký bằng sms đượt :>>
  // cái này chạy được thì cái trên chạy đc, it should work :))
  // lỗi nằm ở cái http-comment bên trong services bên frontend
  // ban đầu cái header cuar http là 'applicationtype-json', trong khi muốn úp file thì header phải là 'multitype/data-form'
  // nếu dùng cách viết ở trên (của viên thì trong file user.router cái router update avatar ko cần thêm middleware nữa, cách viết của chấn là đặt middle trong router á), xài cách của viên thì bỏ middlware trong router ra

  async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return res;
  }

  try {
    // console.log(req);
    // console.log(req.file);
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);
    console.log(cldRes);
    const new_url = cldRes.secure_url;
    console.log(new_url);

    // User.update({ avt_url: new_url })

    User.update({ avt_url: new_url },
      { where: { id: id } }
    )
      .then(num => {
        if (num == 1) {
          return res.status(200).json({
            message: "User avatar was updated successfully.",
            // avt_url: avt_url
          });
        } else {
          return res.status(502).json({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
          });
        }
        console.log(res)
        // console.log("num ----------- ", num)
      })
      .catch(err => {
        console.log("AVT UPDATEEEEEEEE: ", err.message);

        return res.status(503).json({
          message: "Huhuhuhuhuhuhuhuhuhuhuhuhuhuh"
        });
      })

    // await User.save();

    // res.json(cldRes);
  } catch (error) {
    console.log(error);
    return res.status(503).json({
      message: error.message,
    });
  }
};

// Delete a User with the specified account_name in the request
exports.deleteOnebyAccountName = (req, res) => {
  const { accountName } = req.params;

  if (!accountName) {
    res.status(400).send({
      message: "Account_name can not be empty!",
    });
    return;
  }

  var condition = { account_name: { [Op.eq]: `${accountName}` } };
  console.log("condition: ", condition);
  User.destroy({ where: condition })
    .then((num) => {
      if (num > 0) {
        res.send({
          message: `Deleted ${num} user(s) successfully!`,
        });
      } else {
        res.send({
          message: `Cannot delete User with account_name=${accountName}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      console.error("Sequelize Error:", err);
      res.status(500).send({
        message: "Could not delete User with account_name=" + accountName,
      });
    });
};

// Delete a User with greater or equal the specified reportedTimes in the request
exports.deleteOnebyReportedTimes = (req, res) => {
  const { reported_times } = req.body;

  if (!reported_times) {
    res.status(400).send({
      message: "Reported_times is invalid!",
    });
    return;
  }

  var condition = { reported_times: { [Op.gte]: `${reported_times}` } };

  User.destroy({ where: condition })
    .then((num) => {
      if (num > 0) {
        res.send({
          message: `Deleted ${num} user(s) successfully!`,
        });
      } else {
        res.send({
          message: `Cannot delete User with reported_times >= ${reported_times}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Could not delete User with reported_times >= " + reported_times,
      });
    });
};

// Change user status by user id and status param
exports.changeStatusByID = (req, res) => {
  const { id, status } = req.params;

  if (!id || parseInt(status) < 0 || parseInt(status) > 2) {
    res.status(400).send({
      message: "Invalid user id or status!",
    });
    return;
  }

  User.update({ status }, { where: { id } })
    .then((num) => {
      if (num[0] === 1) {
        res.send({
          message: "User status updated successfully!",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      console.error("Sequelize Error:", err);
      res.status(500).send({
        message: "Could not update User with id=" + id,
      });
    });
};

// Check correct password and update new password
exports.changePassword = (req, res) => {
  const { id, oldPassword, newPassword } = req.body;

  if (!id || !oldPassword || !newPassword) {
    res.status(400).send({
      message: "Invalid user id or password!",
    });
    return;
  }

  User.findByPk(id)
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        });
        return;
      }

      const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);

      if (!passwordIsValid) {
        res.status(401).send({
          message: "Current password is incorrect!",
        });
        return;
      }

      const hashedPassword = bcrypt.hashSync(newPassword, 8);

      User.update({ password: hashedPassword }, { where: { id } })
        .then((num) => {
          if (num[0] === 1) {
            res.send({
              message: "User password updated successfully!",
            });
          } else {
            res.send({
              message: `Cannot update User password with id=${id}. Maybe User was not found!`,
            });
          }
        })
        .catch((err) => {
          console.error("Sequelize Error:", err);
          res.status(500).send({
            message: "Could not update User with id=" + id,
          });
        });
    })
    .catch((err) => {
      console.error("Sequelize Error:", err);
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update Name and social link of user by id
exports.updateNameAndSocialLink = (req, res) => {
  const { id, data } = req.body;

  if (!id) {
    res.status(400).send({
      message: "Invalid user id!",
    });
    return;
  }

  // Update user by id with fields in data
  User.update(data, { where: { id } })
    .then((num) => {
      if (num[0] === 1) {
        res.send({
          message: "User updated successfully!",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      console.error("Sequelize Error:", err);
      res.status(500).send({
        message: "Could not update User with id=" + id,
      });
    });
};