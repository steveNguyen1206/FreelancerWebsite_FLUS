module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      account_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      }, 
      password: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      profile_name: {
        type: Sequelize.STRING(50)
      },	
      phone_number: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      nationality: {
        type: Sequelize.STRING(50)
      },
      user_type: {
        type: Sequelize.TINYINT
      },	
      email: {
        type: Sequelize.STRING()
      },
      avt_url: {
        type: Sequelize.STRING(256)
      },
      social_link: {
        type: Sequelize.STRING(512)
      },
      reported_times: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 1 // 0: banned, 1: active
      },
    });
  
    return User;
  };
  