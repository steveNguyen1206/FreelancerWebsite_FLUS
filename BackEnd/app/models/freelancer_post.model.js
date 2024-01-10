module.exports = (sequelize, Sequelize) => {
    const Freelancer_post = sequelize.define("freelancer_post", {
      title: {
        type: Sequelize.STRING(125)
      },
      about_me: {
        type: Sequelize.STRING(512)
      },
      skill_description: {
        type:  Sequelize.STRING(512)
      },
      lowset_price: {
        type:  Sequelize.DOUBLE
      },
      delivery_due: {
        type: Sequelize.INTEGER
      },
      revision_number: {
        type: Sequelize.INTEGER
      },
      delivery_description: {
        type: Sequelize.STRING(512)
      },
      imgage_post_urls: {
        type: Sequelize.STRING(1024)
      }, 
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 1 // 1: active, 0: deactive
      },
    });
  
    return Freelancer_post;
  };
  