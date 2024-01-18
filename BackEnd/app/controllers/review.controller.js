const db = require("../models");
const reviews = db.reviews;
const Op = db.Sequelize.Op;
const users = db.user;

exports.getAverageRating = async (req, res) => {
  const { id } = req.params;

  let data = await reviews.findAll({
    where: {
      user_reviewed: id,
    },
  });

  // for each review, check the user_review has status = 0 or not, if yes, then remove it
  for (let i = 0; i < data.length; i++) {
    let user = await users.findOne({
      where: {
        id: data[i].user_review,
      },
    });

    if (user.status === 0) {
      data.splice(i, 1);
      i--;
    }
  }

  let total = 0;
  let average = 0;
  let count = 0;
  data.forEach((review) => {
    total += parseFloat(review.star);
    count++;
  });
  if (count !== 0) average = total / count;
  else average = 0;
  res.send({ average: average.toFixed(1), count: count });
};
