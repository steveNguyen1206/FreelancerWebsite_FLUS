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
        type: Sequelize.STRING(15)
      },
      nationality: {
        type: Sequelize.STRING(50)
      },
      user_type: {
        type: Sequelize.TINYINT
        // 1: user
        // 2: admin
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
    });
  
    return User;
  };
  