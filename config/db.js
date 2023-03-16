const Sequelize = require("sequelize");
const sequelize = new Sequelize("db-demo-nodejs", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Kết nối db thành công!");
  })
  .catch((err) => {
    console.error("Kết nối db lỗi:", err);
  });

module.exports = sequelize;

// -------------------------------------------------------

// const mysql = require("mysql");

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "db-demo-nodejs",
// });

// connection.connect((err) => {
//   if (err) {
//     console.log("Kết nối CSDL không thành công!");
//   }
// });

// module.exports = connection;
