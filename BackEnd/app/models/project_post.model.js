module.exports = (sequelize, Sequelize) => {
    const Project_post = sequelize.define("project_post", {
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      detail: {
        type:  Sequelize.STRING(512),
        allowNull: false
      },
      budget_min: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      budget_max: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.TINYINT,
        default: 1 // 1: active, 0: deactive
      },
      imgage_post_urls: {
        type: Sequelize.STRING(1024)
      }
    //   user_id: Reference to USER - OK
    });
  
    return Project_post;
  };
  