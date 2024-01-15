module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transaction", {
      amount: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      type: {
        type: Sequelize.TINYINT,
        allowNull: false
      },

      transactionId: {
        type: Sequelize.STRING(50),
        allowNull: false
      }
    });

  
    return Transaction;
  };
  