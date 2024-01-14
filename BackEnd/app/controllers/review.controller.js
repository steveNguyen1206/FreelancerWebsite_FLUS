const db = require("../models");
const reviews = db.reviews;
const Op = db.Sequelize.Op;

exports.getRatingClient = (req, res) => {
  const { id } = req.params;
  const condition = id
    ? { user_reviewed: { [Op.eq]: `${id}` }, type: true }
    : null;

  reviews
    .findAll({ where: condition })
    .then((data) => {
      const count = data.length;
      if (count === 0) {
        res.send({ averageStar: 0, count });
      } else {
        // Calculate the average star rating
        const averageStar =
          data.reduce((total, review) => total + review.star, 0) / count;
        res.send({ averageStar, count });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({
          message:
            err.message || "Some error occurred while retrieving reviews.",
        });
    });
};

exports.getRatingFreelancer = (req, res) => {
  const { id } = req.params;
  const condition = id
    ? { user_reviewed: { [Op.eq]: `${id}` }, type: false }
    : null;

  reviews
    .findAll({ where: condition })
    .then((data) => {
      const count = data.length;
      if (count === 0) {
        res.send({ averageStar: 0, count });
      } else {
        // Calculate the average star rating
        const averageStar =
          data.reduce((total, review) => total + review.star, 0) / count;
        res.send({ averageStar, count });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({
          message:
            err.message || "Some error occurred while retrieving reviews.",
        });
    });
};
