const express = require("express");
const bodyParser = require("body-parser");

// Khởi tạo ứng dụng
const app = express();

// Sử dụng bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Định tuyến các API endpoint
require("./app/routes/authRoutes")(app);

require("./app/routes/usersRoutes")(app);

// Khởi động server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
