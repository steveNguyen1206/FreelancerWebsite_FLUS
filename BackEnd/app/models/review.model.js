module.exports = (sequelize, Sequelize) => {
    const Review = sequelize.define("review", {
      star: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      comment: {
        type:  Sequelize.STRING(512)
      },
      type: {
        type:  Sequelize.BOOLEAN,
        allowNull: false
      },
    //   user_review: Reference to USER
    //   user_reviewed: Reference to USER
    });
  
    return Review;
  };
  