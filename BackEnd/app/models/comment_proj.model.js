module.exports = (sequelize, Sequelize) => {
    const Comment_proj = sequelize.define("comment_proj", {
      comment: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
    //   project_post_id: Reference to PROJECT_POST - OK
    //   user_id: Reference to USER - OK
    });
  
    return Comment_proj;
  };
  