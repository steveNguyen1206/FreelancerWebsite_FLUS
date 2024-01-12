const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
// const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  if (!req.body.account_name || !req.body.password) {
    res.status(400).send({
      message: "Account name and Password can not be empty!",
    });
    return;
  }

  const user = {
    account_name: req.body.account_name,
    password: bcrypt.hashSync(req.body.password, 8),
    profile_name: req.body.profile_name,
    phone_number: req.body.phone_number,
    nationality: req.body.nationality,
    user_type: req.body.user_type,
    email: req.body.email,
    avt_url: req.body.avt_url,
    social_link: req.body.social_link,
    // reported_times: 3, // testing delete users by reported_times
  };

  // Save User in the database
  User.create(user)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      account_name: req.body.account_name,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var authorities = [];
      if (user.user_type === 1) {
        authorities.push("ROLE_NORMAL_USER");
      } else if (user.user_type === 2) {
        authorities.push("ROLE_ADMIN");
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: "HS256",
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        id: user.id,
        account_name: user.account_name,
        email: user.email,
        roles: authorities,
        accessToken: token,
        avt_url: user.avt_url,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.googleSignup = (req, res) => {
  if (!req.body.account_name || !req.body.password) {
    res.status(400).send({
      message: "Account name and Password can not be empty!",
    });
    return;
  }
  console.log("req: " + req.body.account_name + " " + req.body.password);
  User.findOne({
    where: {
      account_name: req.body.account_name,
    },
  })
    .then((user) => {
      if (!user) {
        console.log("IM IN" + req.body.account_name + " " + req.body.password);
        // if not found, create new user
        const newUser = {
          account_name: req.body.account_name,
          password: bcrypt.hashSync(req.body.password, 8),
          profile_name: req.body.profile_name,
          phone_number: "",
          nationality: req.body.nationality,
          user_type: req.body.user_type,
          email: req.body.email,
          avt_url: req.body.avt_url,
          social_link: "",
        };

        // Save newUser in the database
        User.create(newUser)
          .then((user) => {
            console.log("END CREATE1: " + user.account_name + " " + user.password);
            // return access token
            var authorities = [];
            if (user.user_type === 1) {
              authorities.push("ROLE_NORMAL_USER");
            } else if (user.user_type === 2) {
              authorities.push("ROLE_ADMIN");
            }
            console.log("END CREATE2: " + user.account_name + " " + user.password);
            // create token
            const token = jwt.sign({ id: user.id }, config.secret, {
              algorithm: "HS256",
              expiresIn: 86400, // 24 hours
            });
            console.log("END CREATE3: " + user.account_name + " " + user.password);
            // return user info
            res.status(200).send({
              id: user.id,
              account_name: user.account_name,
              email: user.email,
              roles: authorities,
              accessToken: token,
            });
            console.log("END CREATE4: " + user.account_name + " " + user.password);
          })
          .catch((err) => {
           
            console.log("err: ", "Error create user in db");
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the User.",
            });
            return;
          });

        // find newUser in database
        console.log("i: " + req.body.account_name + " " + req.body.password);
        user = User.findOne({
          where: {
            account_name: req.body.account_name,
          },
        });
      } 
    })
};

exports.googleLogin = (req, res) => {
  if (!req.body.account_name || !req.body.password) {
    res.status(400).send({
      message: "Account name and Password can not be empty!",
    });
    return;
  }
  console.log("req: " + req.body.account_name + " " + req.body.password);
  // find user in database
  User.findOne({
    where: {
      account_name: req.body.account_name,
    },
  })
    .then((user) => {
        // check password
        console.log("password meomeomeo -----> ",bcrypt.hashSync(req.body.password, 8))
        console.log("user password meomeomeo -----> ",user.password)
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );

        // if password is not valid, return error
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!",
          });
        }

        // if password is valid, return user info
        var authorities = [];
        if (user.user_type === 1) {
          authorities.push("ROLE_NORMAL_USER");
        } else if (user.user_type === 2) {
          authorities.push("ROLE_ADMIN");
        }

        // create token
        const token = jwt.sign({ id: user.id }, config.secret, {
          algorithm: "HS256",
          expiresIn: 86400, // 24 hours
        });

        // return user info
        res.status(200).send({
          id: user.id,
          account_name: user.account_name,
          email: user.email,
          roles: authorities,
          accessToken: token,
          avt_url: user.avt_url,
        });
      }
    )
    .catch((err) => {
      // return error
      res.status(500).send({ message: err.message });
    });
};

exports.sendIsAdminTrue = (req, res) => {
  res.status(200).send({ isAdmin: true });
};
