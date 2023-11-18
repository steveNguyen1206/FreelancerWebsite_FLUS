const myPassword = process.env.DATABASE_PASSWORD;
console.log(myPassword)

module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: myPassword,
  DB: "flusdb01",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
